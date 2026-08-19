import json
import os
import re
from typing import Any, Dict, List, Optional

from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, ValidationError

from ai.prompts.resume_tailor_prompt import resume_tailor_prompt


class TailoredProjectOut(BaseModel):
    title: str = ""
    bullets: List[str] = Field(default_factory=list)


class SkillGroupOut(BaseModel):
    category: str = "Technical Skills"
    skills: List[str] = Field(default_factory=list)


class TailoredResumeLLMOut(BaseModel):
    professional_summary: str = ""
    prioritized_skills: List[str] = Field(default_factory=list)
    skill_groups: List[SkillGroupOut] = Field(default_factory=list)
    projects: List[TailoredProjectOut] = Field(default_factory=list)
    highlighted_keywords: List[str] = Field(default_factory=list)
    tailoring_notes: str = ""


class ResumeTailorAgent:
    def __init__(self, groq_api_key: str = None, model_id: str = "openai/gpt-oss-120b"):
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY", "")
        self.model_id = os.getenv("GROQ_MODEL", model_id)

    def tailor_resume(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        original_skills = [str(s).strip() for s in (resume_data.get("skills") or []) if str(s).strip()]
        original_projects = resume_data.get("projects") or []
        allowed_skill_set = self._allowed_skills(resume_data, original_skills)

        llm_payload = None
        if self.groq_api_key:
            llm_payload = self._run_langchain_chain(resume_data, job_data)

        if llm_payload:
            print(f"[ResumeTailorAgent] Tailored via LangChain + Groq ({self.model_id})")
            validated = self._validate_and_guard(
                llm_payload,
                original_skills,
                original_projects,
                allowed_skill_set,
                job_data,
                resume_data.get("summary") or "",
            )
        else:
            print("[ResumeTailorAgent] LLM unavailable. Using factual heuristic fallback.")
            validated = self._heuristic_tailor(resume_data, job_data, original_skills, original_projects)

        return validated.model_dump()

    def _run_langchain_chain(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Optional[dict]:
        try:
            llm = ChatGroq(
                model=self.model_id,
                api_key=self.groq_api_key,
                temperature=0.15,
                max_tokens=2500,
            )
            chain = resume_tailor_prompt | llm | JsonOutputParser()
            result = chain.invoke({
                "job_title": job_data.get("title") or "Software Engineer",
                "job_organization": job_data.get("organization") or "",
                "job_description": self._job_description(job_data)[:4000],
                "job_skills": ", ".join(job_data.get("key_skills") or job_data.get("matching_skills") or []) or "Not specified",
                "resume_summary": resume_data.get("summary") or "Not provided",
                "resume_skills": ", ".join(resume_data.get("skills") or []) or "Not listed",
                "resume_projects": self._format_projects(resume_data.get("projects") or []),
                "resume_experience": self._format_experience(resume_data.get("experience") or []),
                "resume_education": json.dumps(resume_data.get("education") or [], default=str)[:1500],
            })
            if isinstance(result, dict):
                return result
            return self._clean_and_parse_json(str(result))
        except Exception as e:
            print(f"[ResumeTailorAgent] LangChain + Groq Exception: {e}")
            return None

    def _validate_and_guard(
        self,
        payload: dict,
        original_skills: List[str],
        original_projects: List[Any],
        allowed_skill_set: List[str],
        job_data: Dict[str, Any],
        original_summary: str,
    ) -> TailoredResumeLLMOut:
        try:
            parsed = TailoredResumeLLMOut.model_validate(payload)
        except ValidationError as e:
            print(f"[ResumeTailorAgent] Pydantic validation failed: {e}")
            parsed = TailoredResumeLLMOut(
                professional_summary=str(payload.get("professional_summary") or ""),
                prioritized_skills=[str(s) for s in (payload.get("prioritized_skills") or [])],
                highlighted_keywords=[str(s) for s in (payload.get("highlighted_keywords") or [])],
                tailoring_notes=str(payload.get("tailoring_notes") or ""),
            )

        allowed_lower = {s.lower(): s for s in allowed_skill_set}
        original_lower = {s.lower(): s for s in original_skills}

        def filter_skills(skills: List[str]) -> List[str]:
            kept = []
            seen = set()
            for skill in skills:
                key = str(skill).strip().lower()
                if not key or key in seen:
                    continue
                canonical = original_lower.get(key) or allowed_lower.get(key)
                if canonical:
                    kept.append(canonical)
                    seen.add(key)
            return kept

        prioritized = filter_skills(parsed.prioritized_skills)
        leftover = [s for s in original_skills if s.lower() not in {x.lower() for x in prioritized}]
        prioritized = prioritized + leftover

        groups = []
        for group in parsed.skill_groups:
            skills = filter_skills(group.skills)
            if skills:
                groups.append(SkillGroupOut(category=group.category or "Technical Skills", skills=skills))
        if not groups and prioritized:
            groups = [SkillGroupOut(category="Technical Skills", skills=prioritized)]

        original_titles = []
        original_by_title = {}
        for project in original_projects:
            if isinstance(project, dict):
                title = str(project.get("title") or "Project").strip()
                original_titles.append(title)
                original_by_title[title.lower()] = project
            else:
                title = str(project)
                original_titles.append(title)
                original_by_title[title.lower()] = {"title": title, "description": ""}

        guarded_projects: List[TailoredProjectOut] = []
        used = set()
        for project in parsed.projects:
            match_key = self._match_project_title(project.title, list(original_by_title.keys()))
            if not match_key or match_key in used:
                continue
            used.add(match_key)
            source = original_by_title[match_key]
            source_text = f"{source.get('title', '')} {source.get('description', '')}"
            bullets = [b.strip() for b in (project.bullets or []) if b and str(b).strip()]
            if not bullets:
                bullets = self._description_to_bullets(source.get("description") or source_text)
            guarded_projects.append(
                TailoredProjectOut(title=str(source.get("title") or project.title), bullets=bullets[:6])
            )

        for title in original_titles:
            if title.lower() not in used:
                source = original_by_title[title.lower()]
                guarded_projects.append(
                    TailoredProjectOut(
                        title=title,
                        bullets=self._description_to_bullets(source.get("description") or title),
                    )
                )
                used.add(title.lower())

        job_text = self._job_description(job_data).lower()
        keywords = []
        for kw in parsed.highlighted_keywords:
            token = str(kw).strip()
            if token and token.lower() in job_text:
                keywords.append(token)
        if not keywords:
            for skill in prioritized[:8]:
                if skill.lower() in job_text:
                    keywords.append(skill)

        summary = (parsed.professional_summary or "").strip() or (original_summary or "").strip()

        notes = parsed.tailoring_notes.strip() or (
            "Summary, skills order, and project bullets were rephrased from the original resume only."
        )

        return TailoredResumeLLMOut(
            professional_summary=summary,
            prioritized_skills=prioritized,
            skill_groups=groups,
            projects=guarded_projects,
            highlighted_keywords=keywords[:12],
            tailoring_notes=notes,
        )

    def _heuristic_tailor(
        self,
        resume_data: Dict[str, Any],
        job_data: Dict[str, Any],
        original_skills: List[str],
        original_projects: List[Any],
    ) -> TailoredResumeLLMOut:
        job_text = self._job_description(job_data).lower()
        matched = [s for s in original_skills if s.lower() in job_text]
        unmatched = [s for s in original_skills if s.lower() not in {m.lower() for m in matched}]
        prioritized = matched + unmatched

        projects = []
        for project in original_projects:
            if isinstance(project, dict):
                title = str(project.get("title") or "Project")
                desc = str(project.get("description") or "")
            else:
                title = str(project)
                desc = ""
            projects.append(TailoredProjectOut(title=title, bullets=self._description_to_bullets(desc or title)))

        summary = (resume_data.get("summary") or "").strip()
        role = job_data.get("title") or "the target role"
        org = job_data.get("organization") or "the company"
        if summary:
            tailored_summary = (
                f"{summary} Seeking to apply these strengths to the {role} role at {org}."
            )
        else:
            skill_preview = ", ".join(prioritized[:6]) or "software engineering fundamentals"
            tailored_summary = (
                f"Computer science candidate with experience in {skill_preview}, "
                f"tailoring existing project work toward {role}."
            )

        groups = []
        if matched:
            groups.append(SkillGroupOut(category="Job-Matched Skills", skills=matched))
        if unmatched:
            groups.append(SkillGroupOut(category="Additional Skills", skills=unmatched))

        return TailoredResumeLLMOut(
            professional_summary=tailored_summary,
            prioritized_skills=prioritized,
            skill_groups=groups,
            projects=projects,
            highlighted_keywords=matched[:12],
            tailoring_notes="Heuristic fallback: skills reordered by job keyword overlap; no new facts added.",
        )

    def _allowed_skills(self, resume_data: Dict[str, Any], original_skills: List[str]) -> List[str]:
        blobs = [resume_data.get("summary") or "", resume_data.get("raw_text") or ""]
        for project in resume_data.get("projects") or []:
            if isinstance(project, dict):
                blobs.append(str(project.get("title") or ""))
                blobs.append(str(project.get("description") or ""))
        for exp in resume_data.get("experience") or []:
            if isinstance(exp, dict):
                blobs.append(str(exp.get("title") or ""))
                blobs.append(str(exp.get("company") or ""))
                blobs.append(str(exp.get("description") or ""))
        text = " ".join(blobs)
        extra = []
        for skill in original_skills:
            extra.append(skill)
        # Keep original skills as the allowlist core; extras only if already listed.
        return extra

    def _match_project_title(self, incoming: str, original_keys: List[str]) -> Optional[str]:
        key = (incoming or "").strip().lower()
        if not key:
            return None
        if key in original_keys:
            return key
        for orig in original_keys:
            if key in orig or orig in key:
                return orig
        return None

    def _description_to_bullets(self, description: str) -> List[str]:
        text = (description or "").strip()
        if not text:
            return []
        parts = re.split(r"(?:[\n\r]+|•|\u2022|;|\.(?=\s+[A-Z]))", text)
        bullets = [p.strip(" -•\t") for p in parts if p and len(p.strip()) > 8]
        if not bullets:
            bullets = [text]
        return bullets[:6]

    def _format_projects(self, projects: List[Any]) -> str:
        lines = []
        for project in projects:
            if isinstance(project, dict):
                lines.append(f"- {project.get('title', 'Project')}: {project.get('description', '')}")
            else:
                lines.append(f"- {project}")
        return "\n".join(lines) or "None listed"

    def _format_experience(self, experience: List[Any]) -> str:
        lines = []
        for item in experience:
            if isinstance(item, dict):
                lines.append(
                    f"- {item.get('title', '')} at {item.get('company', '')}: {item.get('description', '')}"
                )
            else:
                lines.append(f"- {item}")
        return "\n".join(lines) or "None listed"

    def _job_description(self, job_data: Dict[str, Any]) -> str:
        parts = [
            job_data.get("requirements_summary") or "",
            job_data.get("core_responsibilities") or "",
            " ".join(job_data.get("key_skills") or []),
        ]
        return "\n".join([p for p in parts if p]).strip() or "Software engineering internship."

    def _clean_and_parse_json(self, text: str) -> Optional[dict]:
        try:
            cleaned = re.sub(r"```(?:json)?", "", text).strip().strip("`").strip()
            match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            return json.loads(cleaned)
        except Exception as e:
            print(f"[ResumeTailorAgent] JSON Parsing Exception: {e}")
            return None
