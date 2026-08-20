"""Cover letter drafting agent powered by LangChain + Groq.

Produces a structured 3-paragraph cover letter JSON payload with factual
guardrails and a deterministic heuristic fallback when the LLM is unavailable.
"""

import json
import os
import re
from typing import Any, Dict, List, Optional

from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, ValidationError

from ai.prompts.cover_letter_prompt import cover_letter_prompt


class CoverLetterHeaderOut(BaseModel):
    """Contact header fields embedded in the cover letter document."""

    candidate_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    github: str = ""
    linkedin: str = ""


class CoverLetterLLMOut(BaseModel):
    """Validated LLM/heuristic output schema for cover letter generation."""

    header: CoverLetterHeaderOut = Field(default_factory=CoverLetterHeaderOut)
    salutation: str = "Dear Hiring Manager,"
    body_paragraphs: List[str] = Field(default_factory=list)
    closing: str = "Sincerely,"
    candidate_name: str = ""


class CoverLetterAgent:
    """Service that drafts targeted cover letters from candidate and job context."""

    def __init__(self, groq_api_key: str = None, model_id: str = "openai/gpt-oss-120b"):
        """Initialize the agent with Groq credentials and model id.

        Args:
            groq_api_key: Optional Groq API key; falls back to ``GROQ_API_KEY`` env.
            model_id: Default Groq model identifier.
        """
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY", "")
        self.model_id = os.getenv("GROQ_MODEL", model_id)

    def generate_cover_letter(
        self,
        candidate: Dict[str, Any],
        job: Dict[str, Any],
        company_name: str = "",
    ) -> Dict[str, Any]:
        """Generate a structured cover letter for the given candidate and job.

        Args:
            candidate: Resume-derived profile (contact, summary, skills, projects).
            job: Target job metadata and description fields.
            company_name: Optional company override (defaults to job organization).

        Returns:
            dict: Validated cover letter fields ready for API persistence/export.
        """
        company = company_name or job.get("organization") or "the company"
        llm_payload = None
        if self.groq_api_key:
            llm_payload = self._run_langchain_chain(candidate, job, company)

        if llm_payload:
            print(f"[CoverLetterAgent] Generated via LangChain + Groq ({self.model_id})")
            return self._validate(llm_payload, candidate, company, job).model_dump()

        print("[CoverLetterAgent] LLM unavailable. Using factual heuristic fallback.")
        return self._heuristic(candidate, job, company).model_dump()

    def _run_langchain_chain(
        self,
        candidate: Dict[str, Any],
        job: Dict[str, Any],
        company: str,
    ) -> Optional[dict]:
        try:
            contact = candidate.get("contact_info") or {}
            llm = ChatGroq(
                model=self.model_id,
                api_key=self.groq_api_key,
                temperature=0.25,
                max_tokens=1800,
            )
            chain = cover_letter_prompt | llm | JsonOutputParser()
            result = chain.invoke({
                "job_title": job.get("title") or "Software Engineer",
                "company_name": company,
                "job_description": self._job_description(job)[:3500],
                "candidate_name": contact.get("name") or candidate.get("name") or "Candidate",
                "email": contact.get("email") or "",
                "phone": contact.get("phone") or "",
                "location": contact.get("location") or contact.get("address") or "",
                "github": contact.get("github") or "",
                "linkedin": contact.get("linkedin") or "",
                "summary": candidate.get("summary") or "",
                "skills": ", ".join(candidate.get("skills") or []) or "Not listed",
                "projects": self._format_projects(candidate.get("projects") or []),
                "experience": self._format_experience(candidate.get("experience") or []),
            })
            if isinstance(result, dict):
                return result
            return self._clean_and_parse_json(str(result))
        except Exception as e:
            print(f"[CoverLetterAgent] LangChain + Groq Exception: {e}")
            return None

    def _validate(
        self,
        payload: dict,
        candidate: Dict[str, Any],
        company: str,
        job: Dict[str, Any],
    ) -> CoverLetterLLMOut:
        contact = candidate.get("contact_info") or {}
        try:
            parsed = CoverLetterLLMOut.model_validate(payload)
        except ValidationError as e:
            print(f"[CoverLetterAgent] Pydantic validation failed: {e}")
            paragraphs = payload.get("body_paragraphs") if isinstance(payload, dict) else []
            parsed = CoverLetterLLMOut(
                salutation=str((payload or {}).get("salutation") or "Dear Hiring Manager,"),
                body_paragraphs=[str(p) for p in (paragraphs or []) if p],
                closing=str((payload or {}).get("closing") or "Sincerely,"),
                candidate_name=str((payload or {}).get("candidate_name") or contact.get("name") or ""),
            )

        name = (
            parsed.candidate_name
            or parsed.header.candidate_name
            or contact.get("name")
            or "Candidate"
        )
        header = CoverLetterHeaderOut(
            candidate_name=parsed.header.candidate_name or name,
            email=parsed.header.email or contact.get("email") or "",
            phone=parsed.header.phone or contact.get("phone") or "",
            location=parsed.header.location or contact.get("location") or contact.get("address") or "",
            github=parsed.header.github or contact.get("github") or "",
            linkedin=parsed.header.linkedin or contact.get("linkedin") or "",
        )

        paragraphs = [str(p).strip() for p in (parsed.body_paragraphs or []) if str(p).strip()]
        if len(paragraphs) < 3:
            fallback = self._heuristic(candidate, job, company)
            while len(paragraphs) < 3 and len(fallback.body_paragraphs) > len(paragraphs):
                paragraphs.append(fallback.body_paragraphs[len(paragraphs)])
        paragraphs = paragraphs[:3]
        while len(paragraphs) < 3:
            paragraphs.append(self._heuristic(candidate, job, company).body_paragraphs[len(paragraphs)])

        salutation = (parsed.salutation or "Dear Hiring Manager,").strip()
        if not salutation.endswith(","):
            salutation = salutation.rstrip(".") + ","

        closing = (parsed.closing or "Sincerely,").strip()
        if not closing.endswith(","):
            closing = closing.rstrip(".") + ","

        return CoverLetterLLMOut(
            header=header,
            salutation=salutation,
            body_paragraphs=paragraphs,
            closing=closing,
            candidate_name=name,
        )

    def _heuristic(self, candidate: Dict[str, Any], job: Dict[str, Any], company: str) -> CoverLetterLLMOut:
        contact = candidate.get("contact_info") or {}
        name = contact.get("name") or "Candidate"
        title = job.get("title") or "the role"
        skills = candidate.get("skills") or []
        skill_preview = ", ".join(skills[:5]) if skills else "software engineering fundamentals"
        projects = candidate.get("projects") or []
        project_bits = []
        for project in projects[:3]:
            if isinstance(project, dict):
                project_bits.append(str(project.get("title") or "a technical project"))
            else:
                project_bits.append(str(project))
        project_text = ", ".join(project_bits) if project_bits else "relevant academic projects"

        p1 = (
            f"I am writing to express my strong interest in the {title} position at {company}. "
            f"With a foundation in {skill_preview}, I am eager to contribute to your team and grow through hands-on impact."
        )
        p2 = (
            f"Through work on {project_text}, I have applied practical engineering skills that align with your requirements. "
            f"I focus on building reliable solutions, collaborating effectively, and continuously improving technical quality."
        )
        p3 = (
            f"I would welcome the opportunity to discuss how I can add value to {company} in an interview. "
            f"Thank you for your time and consideration."
        )

        return CoverLetterLLMOut(
            header=CoverLetterHeaderOut(
                candidate_name=name,
                email=contact.get("email") or "",
                phone=contact.get("phone") or "",
                location=contact.get("location") or contact.get("address") or "",
                github=contact.get("github") or "",
                linkedin=contact.get("linkedin") or "",
            ),
            salutation="Dear Hiring Manager,",
            body_paragraphs=[p1, p2, p3],
            closing="Sincerely,",
            candidate_name=name,
        )

    def _job_description(self, job: Dict[str, Any]) -> str:
        parts = [
            job.get("requirements_summary") or "",
            job.get("core_responsibilities") or "",
            " ".join(job.get("key_skills") or []),
        ]
        return "\n".join([p for p in parts if p]).strip() or "Software engineering internship."

    def _format_projects(self, projects: List[Any]) -> str:
        lines = []
        for project in projects:
            if isinstance(project, dict):
                title = project.get("title") or "Project"
                desc = project.get("description") or ""
                bullets = project.get("bullets") or []
                detail = desc or "; ".join([str(b) for b in bullets if b])
                lines.append(f"- {title}: {detail}")
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

    def _clean_and_parse_json(self, text: str) -> Optional[dict]:
        try:
            cleaned = re.sub(r"```(?:json)?", "", text).strip().strip("`").strip()
            match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            return json.loads(cleaned)
        except Exception as e:
            print(f"[CoverLetterAgent] JSON Parsing Exception: {e}")
            return None
