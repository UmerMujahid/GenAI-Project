import os
import json
import requests
from typing import List, Optional
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser
from ai.prompts.job_matching_prompt import job_scoring_prompt


class JobDiscoveryAgent:
    def __init__(self, groq_api_key: str = None, rapidapi_key: str = None):
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY", "")
        self.rapidapi_key = rapidapi_key or os.getenv("RAPIDAPI_KEY", "6e0040114fmsh3b03e147ef4840cp1560d1jsnfa29bf0d6128")
        self.model_id = "llama-3.3-70b-versatile"
        self.active_jobs_url = "https://active-jobs-db.p.rapidapi.com/active-ats"

    async def discover_jobs(self, resume_data: dict, max_results: int = 3) -> List[dict]:
        skills = resume_data.get("skills", [])
        role = resume_data.get("role_preference", "")
        city = resume_data.get("city", "Pakistan")
        summary = resume_data.get("summary", "")

        print(f"[JobDiscoveryAgent] Starting job search for role: '{role}', city: '{city}', skills: {skills[:5]}")

        # Determine target title filter from candidate role or skills
        target_title = role if role else (skills[0] if skills else "Developer")

        # Step 1: Call Active Jobs DB API with time_frame=7d and title parameter (fetch limit 5 to conserve quota)
        raw_jobs = self._call_active_jobs_db(time_frame="7d", title=target_title, limit=5)
        if not raw_jobs and target_title != "Developer":
            # Fallback to general "Developer" title if specific title returned 0
            raw_jobs = self._call_active_jobs_db(time_frame="7d", title="Developer", limit=5)
        print(f"[JobDiscoveryAgent] Fetched {len(raw_jobs)} raw jobs from Active Jobs DB")

        if not raw_jobs:
            print("[JobDiscoveryAgent] No jobs returned from Active Jobs DB.")
            return []

        # Step 2: Score jobs against candidate resume using LLM (up to 5 jobs max)
        scored_jobs = []
        for job in raw_jobs[:5]:
            score_analysis = self._score_job_with_llm(job, skills, role, city, summary)
            job.update(score_analysis)
            scored_jobs.append(job)

        # Step 3: Sort by highest match score and return top matched jobs (max 3)
        scored_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        top_jobs = scored_jobs[:max_results]
        print(f"[JobDiscoveryAgent] Returning top {len(top_jobs)} matched internships with full details")
        return top_jobs

    def _call_active_jobs_db(self, time_frame: str = "7d", title: str = "Developer", limit: int = 10) -> List[dict]:
        if not self.rapidapi_key:
            print("[JobDiscoveryAgent] No RapidAPI Key provided.")
            return []

        headers = {
            "x-rapidapi-key": self.rapidapi_key,
            "x-rapidapi-host": "active-jobs-db.p.rapidapi.com"
        }
        params = {
            "time_frame": time_frame,
            "title": title,
            "limit": str(limit)
        }

        try:
            print(f"[JobDiscoveryAgent] Direct HTTP GET to Active Jobs DB API: {self.active_jobs_url}")
            response = requests.get(self.active_jobs_url, headers=headers, params=params, timeout=20)

            if response.status_code != 200:
                print(f"[JobDiscoveryAgent] Active Jobs DB error status {response.status_code}: {response.text[:300]}")
                return []

            data = response.json()
            if isinstance(data, dict):
                job_list = data.get("data", data.get("jobs", []))
            elif isinstance(data, list):
                job_list = data
            else:
                job_list = []

            print(f"[JobDiscoveryAgent] Received {len(job_list)} items from Active Jobs DB")

            extracted_jobs = []
            for item in job_list:
                # Extract salary details
                salary_obj = item.get("salary") or {}
                val_obj = salary_obj.get("value") or {}
                sal_min = item.get("ai_salary_min_value") or val_obj.get("minValue")
                sal_max = item.get("ai_salary_max_value") or val_obj.get("maxValue")
                sal_curr = item.get("ai_salary_currency") or salary_obj.get("currency", "USD")
                sal_unit = item.get("ai_salary_unit_text") or val_obj.get("unitText", "YEAR")

                extracted_jobs.append({
                    "job_api_id": str(item.get("id", "")),
                    "title": item.get("title", "Software Engineering Intern"),
                    "organization": item.get("organization", "Tech Company"),
                    "organization_url": item.get("organization_url", ""),
                    "apply_url": item.get("url", ""),
                    "date_posted": item.get("date_posted", ""),
                    "employment_type": self._clean_list(item.get("employment_type") or item.get("ai_employment_type") or ["Full Time"]),
                    "salary_currency": sal_curr,
                    "salary_min": float(sal_min) if sal_min else None,
                    "salary_max": float(sal_max) if sal_max else None,
                    "salary_unit": sal_unit,
                    "work_arrangement": item.get("ai_work_arrangement", "Remote OK"),
                    "experience_level": item.get("ai_experience_level", "Entry Level / Internship"),
                    "education": self._clean_list(item.get("ai_education")),
                    "visa_sponsorship": bool(item.get("ai_visa_sponsorship", False)),
                    "key_skills": self._clean_list(item.get("ai_key_skills")),
                    "core_responsibilities": item.get("ai_core_responsibilities", "") or "",
                    "requirements_summary": item.get("ai_requirements_summary", "") or "",
                    "benefits": self._clean_list(item.get("ai_benefits")),
                    "source_platform": "Active Jobs DB"
                })

            return extracted_jobs

        except Exception as e:
            print(f"[JobDiscoveryAgent] Exception during HTTP request: {e}")
            return []

    def _clean_list(self, val) -> list:
        if not val:
            return []
        if isinstance(val, list):
            return [str(x) for x in val if x is not None]
        if isinstance(val, str):
            return [val]
        return []

    def _score_job_with_llm(self, job: dict, skills: list, role: str, city: str, summary: str) -> dict:
        if not self.groq_api_key:
            return {"match_score": 75, "matching_skills": skills[:3], "missing_skills": [], "reasoning": "LLM scoring skipped (no Groq key)."}

        try:
            llm = ChatGroq(
                model=self.model_id,
                api_key=self.groq_api_key,
                temperature=0.1,
                max_tokens=600
            )

            chain = job_scoring_prompt | llm | JsonOutputParser()

            job_skills = self._clean_list(job.get("key_skills"))
            resp_summary = job.get("core_responsibilities", "") or ""
            req_summary = job.get("requirements_summary", "") or ""

            result = chain.invoke({
                "resume_skills": ", ".join(skills) if skills else "Software development, Python, Computer Science",
                "resume_role": role or "Software Developer",
                "resume_location": city or "Pakistan",
                "resume_summary": summary or "Computer Science candidate",
                "job_title": job.get("title", ""),
                "job_company": job.get("organization", ""),
                "job_location": job.get("work_arrangement", "Remote"),
                "job_description": f"{resp_summary} {req_summary}"[:450],
                "job_skills": ", ".join(job_skills[:8]) if job_skills else "General software development skills"
            })

            if isinstance(result, dict):
                score = int(result.get("match_score", 75))
                return {
                    "match_score": min(100, max(0, score)),
                    "matching_skills": self._clean_list(result.get("matching_skills")),
                    "missing_skills": self._clean_list(result.get("missing_skills")),
                    "reasoning": str(result.get("reasoning", ""))
                }

        except Exception as e:
            print(f"[JobDiscoveryAgent] LLM scoring exception: {e}")

        return {"match_score": 70, "matching_skills": skills[:2], "missing_skills": [], "reasoning": "Basic match based on profile background."}
