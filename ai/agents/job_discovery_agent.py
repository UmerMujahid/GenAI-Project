"""Job discovery agent using JobSpy scraping and Groq fit scoring.

Filters non-technical roles, scrapes live listings, and returns ranked matches
aligned to a candidate resume profile.
"""

import os
import re
import json
import pandas as pd
from typing import List, Optional
from jobspy import scrape_jobs
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from ai.prompts.job_matching_prompt import job_scoring_prompt


# Positive Tech & Engineering Title Whitelist (At least one must match)
TECH_TITLE_KEYWORDS = [
    r"\bsoftware\b", r"\bdeveloper\b", r"\bengineer\b", r"\bengineering\b",
    r"\bfrontend\b", r"\bfront-end\b", r"\bbackend\b", r"\bback-end\b",
    r"\bfull\s*stack\b", r"\bstack\b", r"\bmern\b", r"\bmean\b", r"\blamp\b",
    r"\bweb\b", r"\breact\b", r"\bnode\b", r"\bpython\b", r"\bnext\.?js\b",
    r"\bvue\b", r"\bangular\b", r"\bphp\b", r"\blaravel\b", r"\bgolang\b",
    r"\bjava\b", r"\bc\+\+\b", r"\b\.net\b", r"\bai\b", r"\bartificial intelligence\b",
    r"\bmachine learning\b", r"\bdeep learning\b", r"\bdata\b", r"\bsqa\b",
    r"\bqa\b", r"\bquality assurance\b", r"\btester\b", r"\btesting\b",
    r"\bcloud\b", r"\bdevops\b", r"\bflutter\b", r"\bandroid\b", r"\bios\b",
    r"\bmobile\b", r"\bintern\b", r"\binternship\b", r"\binternee\b", r"\btrainee\b",
    r"\bprogrammer\b", r"\bui/ux\b", r"\bux\b", r"\bui\b", r"\bdatabase\b",
    r"\bsecurity\b", r"\bcyber\b", r"\bit\b", r"\btech\b", r"\bcomputer\b", r"\btechnology\b"
]

# Negative Non-Tech / Administrative Blacklist (Immediate Rejection)
NON_TECH_BLACKLIST = [
    r"\bcabin\b", r"\bsupervisor\b", r"\bflight\b", r"\battendant\b", r"\benvironmental\b",
    r"\baffairs\b", r"\bhr\b", r"\bhuman resources\b", r"\btalent acquisition\b",
    r"\brecruiter\b", r"\brecruitment\b", r"\baccountant\b", r"\baccounting\b",
    r"\bbookkeeper\b", r"\bfinance officer\b", r"\btele-sales\b", r"\btelesales\b",
    r"\btelemarketing\b", r"\bsales representative\b", r"\bsales executive\b",
    r"\bsales officer\b", r"\bsales manager\b", r"\breal estate\b", r"\bdriver\b",
    r"\breceptionist\b", r"\bcook\b", r"\bchef\b", r"\bmedical\b", r"\bnurse\b",
    r"\bphysician\b", r"\bstore keeper\b", r"\bcashier\b", r"\bsecurity guard\b",
    r"\bcleaner\b", r"\bpeon\b", r"\bcall center\b", r"\bcustomer support\b",
    r"\bcustomer care\b", r"\bcustomer service\b", r"\badministrative assistant\b",
    r"\boffice assistant\b", r"\boffice boy\b", r"\bvirtual assistant\b",
    r"\bmerchandiser\b", r"\bpharmacist\b", r"\btextile\b"
]


class JobDiscoveryAgent:
    """Discovers and scores live job listings against a candidate resume."""

    def __init__(self, groq_api_key: str = None, rapidapi_key: str = None, model_id: str = "openai/gpt-oss-120b"):
        """Initialize scraping/scoring credentials.

        Args:
            groq_api_key: Optional Groq API key for LLM scoring.
            rapidapi_key: Optional RapidAPI key (reserved for alternate sources).
            model_id: Default Groq model id when ``GROQ_MODEL`` is unset.
        """
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY", "")
        self.model_id = os.getenv("GROQ_MODEL", model_id)

    async def discover_jobs(self, resume_data: dict, max_results: int = 5) -> List[dict]:
        """Scrape and score jobs for a resume profile.

        Args:
            resume_data: Parsed resume fields (skills, role, city, summary).
            max_results: Maximum number of ranked jobs to return.

        Returns:
            List[dict]: Ranked job match dictionaries with scores and reasoning.
        """
        skills = resume_data.get("skills", [])
        role = resume_data.get("role_preference", "Software Engineer")
        city = resume_data.get("city", "Pakistan")
        summary = resume_data.get("summary", "")

        location_search = city if city and city.lower() != "pakistan" else "Pakistan"

        # Step 1: Generate targeted search queries
        search_queries = self._generate_search_queries(skills, role, summary)
        print(f"[JobDiscoveryAgent] Scraping jobs for queries: {search_queries}")

        # Step 2: Scrape jobs using python-jobspy across platforms
        all_raw_jobs = []
        seen_keys = set()

        for query in search_queries:
            scraped = self._scrape_with_jobspy(query, location_search, results_wanted=10)
            for job in scraped:
                dedup_key = f"{job['title'].lower()}|{job['organization'].lower()}"
                if dedup_key not in seen_keys:
                    seen_keys.add(dedup_key)
                    # Must pass strict tech role whitelist and blacklist check
                    if self._is_valid_tech_job(job["title"], job.get("requirements_summary", "")):
                        all_raw_jobs.append(job)

        if not all_raw_jobs:
            print("[JobDiscoveryAgent] Running fallback query 'Software Engineer Intern Pakistan'")
            fallback_jobs = self._scrape_with_jobspy("Software Engineer Intern", "Pakistan", results_wanted=12)
            for job in fallback_jobs:
                dedup_key = f"{job['title'].lower()}|{job['organization'].lower()}"
                if dedup_key not in seen_keys and self._is_valid_tech_job(job["title"], job.get("requirements_summary", "")):
                    seen_keys.add(dedup_key)
                    all_raw_jobs.append(job)

        print(f"[JobDiscoveryAgent] Found {len(all_raw_jobs)} verified tech jobs for scoring")

        if not all_raw_jobs:
            return []

        # Step 3: Score jobs against candidate resume using LLM
        scored_jobs = []
        for job in all_raw_jobs[:12]:
            score_analysis = self._score_job_with_llm(job, skills, role, city, summary)
            job.update(score_analysis)
            # Only keep genuine matches scoring >= 40%
            if job.get("match_score", 0) >= 40:
                scored_jobs.append(job)

        # Step 4: Sort by match score descending and return top results
        scored_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        top_jobs = scored_jobs[:max_results]
        print(f"[JobDiscoveryAgent] Returning top {len(top_jobs)} relevant jobs with scores: {[j.get('match_score') for j in top_jobs]}")
        return top_jobs

    def _generate_search_queries(self, skills: list, role: str, summary: str) -> List[str]:
        skills_str = " ".join(skills).lower()
        if any(w in skills_str for w in ["python", "ai", "machine learning", "pytorch", "tensorflow", "fastapi"]):
            return ["Python Developer Intern", "AI Engineer Intern", "Machine Learning Intern"]
        elif any(w in skills_str for w in ["react", "frontend", "next.js", "javascript", "typescript", "tailwind"]):
            return ["React Developer Intern", "Frontend Developer Intern", "Web Developer Intern"]
        elif any(w in skills_str for w in ["flutter", "react native", "android", "ios", "mobile"]):
            return ["Flutter Developer Intern", "Mobile App Developer Intern"]
        elif any(w in skills_str for w in ["qa", "sqa", "selenium", "testing", "quality assurance"]):
            return ["SQA Intern", "Software Quality Assurance Intern"]
        elif any(w in skills_str for w in ["node", "backend", "django", "sql", "mongodb"]):
            return ["Backend Developer Intern", "Full Stack Intern"]
        
        return ["Software Engineer Intern", "Junior Software Developer", "IT Intern"]

    def _is_valid_tech_job(self, title: str, description: str = "") -> bool:
        title_lower = title.lower()

        # 1. Reject if matches any non-tech blacklist keyword
        for pattern in NON_TECH_BLACKLIST:
            if re.search(pattern, title_lower, re.IGNORECASE):
                print(f"[JobDiscoveryAgent] Rejected non-tech title: '{title}'")
                return False

        # 2. Accept if title matches positive tech keywords
        for pattern in TECH_TITLE_KEYWORDS:
            if re.search(pattern, title_lower, re.IGNORECASE):
                return True

        # 3. Fallback: Check if description explicitly requires programming/CS skills
        desc_lower = description[:500].lower()
        if any(k in desc_lower for k in ["python", "javascript", "react", "programming", "software engineering", "computer science"]):
            return True

        print(f"[JobDiscoveryAgent] Rejected unverified non-tech role: '{title}'")
        return False

    def _scrape_with_jobspy(self, search_term: str, location: str, results_wanted: int = 10) -> List[dict]:
        try:
            df = scrape_jobs(
                site_name=["indeed", "linkedin", "google"],
                search_term=search_term,
                location=location,
                results_wanted=results_wanted,
                hours_old=720,
                country_indeed="Pakistan"
            )

            if df is None or df.empty:
                return []

            extracted = []
            seen_keys = set()

            for _, row in df.iterrows():
                title = str(row.get("title") or "").strip()
                company = str(row.get("company") or "").strip()
                if not title or not company:
                    continue

                dedup_key = f"{title.lower()}|{company.lower()}"
                if dedup_key in seen_keys:
                    continue
                seen_keys.add(dedup_key)

                # Clean and validate URLs (prevent 'nan' string from pandas float NaN)
                raw_apply = row.get("job_url_direct") if pd.notna(row.get("job_url_direct")) else row.get("job_url")
                apply_url = ""
                if raw_apply and pd.notna(raw_apply):
                    val_str = str(raw_apply).strip()
                    if val_str.lower() not in ["nan", "none", "null", "undefined", ""]:
                        apply_url = val_str if val_str.startswith("http") else f"https://{val_str}"

                # Fallback to direct search URL if apply_url is empty
                if not apply_url:
                    import urllib.parse
                    search_query = f"{title} {company} jobs Pakistan"
                    apply_url = f"https://www.google.com/search?q={urllib.parse.quote(search_query)}"

                raw_org = row.get("company_url_direct") if pd.notna(row.get("company_url_direct")) else row.get("company_url")
                org_url = ""
                if raw_org and pd.notna(raw_org):
                    val_org = str(raw_org).strip()
                    if val_org.lower() not in ["nan", "none", "null", "undefined", ""]:
                        org_url = val_org if val_org.startswith("http") else f"https://{val_org}"

                desc = str(row.get("description") or "").strip()
                site_name = str(row.get("site") or "Indeed").capitalize()
                raw_location = str(row.get("location") or "Pakistan").strip()

                is_remote = bool(row.get("is_remote")) if pd.notna(row.get("is_remote")) else ("remote" in raw_location.lower() or "remote" in desc[:200].lower())
                work_arrangement = "Remote OK" if is_remote else ("Hybrid" if "hybrid" in desc[:300].lower() else "Onsite")

                min_sal = float(row.get("min_amount")) if pd.notna(row.get("min_amount")) else None
                max_sal = float(row.get("max_amount")) if pd.notna(row.get("max_amount")) else None
                currency = str(row.get("currency")) if pd.notna(row.get("currency")) else "PKR"
                interval = str(row.get("interval")) if pd.notna(row.get("interval")) else "MONTH"

                initial_exp = "Not specified"
                exp_match = re.search(r'(\d+\+?\s*(?:to|-)?\s*\d*)\s*(?:years?|yrs?)(?:\s+of)?\s+experience', desc, re.IGNORECASE)
                if exp_match:
                    initial_exp = f"{exp_match.group(1).strip()} years"
                elif "intern" in title.lower() or "trainee" in title.lower() or "fresh" in desc.lower()[:300]:
                    initial_exp = "Fresh / Internship"

                extracted.append({
                    "job_api_id": str(row.get("id") or ""),
                    "title": title,
                    "organization": company,
                    "organization_url": org_url,
                    "apply_url": apply_url,
                    "date_posted": str(row.get("date_posted") or "Recent"),
                    "employment_type": [str(row.get("job_type") or "Full Time")],
                    "salary_currency": currency,
                    "salary_min": min_sal,
                    "salary_max": max_sal,
                    "salary_unit": interval,
                    "work_arrangement": work_arrangement,
                    "experience_level": initial_exp,
                    "education": ["Bachelor Degree in CS / IT / Software Engineering"],
                    "visa_sponsorship": False,
                    "key_skills": [],
                    "core_responsibilities": desc[:500] + ("..." if len(desc) > 500 else ""),
                    "requirements_summary": desc,
                    "benefits": ["Career growth", "Mentorship"],
                    "source_platform": f"JobSpy ({site_name})"
                })

            return extracted

        except Exception as e:
            print(f"[JobDiscoveryAgent] JobSpy scrape exception: {e}")
            return []

    def _get_groq_key(self) -> str:
        return os.getenv("GROQ_API_KEY") or self.groq_api_key or ""

    def _get_model_id(self) -> str:
        return os.getenv("GROQ_MODEL") or self.model_id or "openai/gpt-oss-120b"

    def _score_job_with_llm(self, job: dict, skills: list, role: str, city: str, summary: str) -> dict:
        full_desc = job.get("requirements_summary", "") or job.get("core_responsibilities", "")
        desc_sample = full_desc[:1400] if len(full_desc) > 1400 else full_desc

        api_key = self._get_groq_key()
        if not api_key:
            resume_skills_lower = [s.lower() for s in skills]
            matched = [s for s in skills if s.lower() in desc_sample.lower()]
            missing = [s for s in ["Git", "Docker", "SQL", "REST API", "TypeScript"] if s.lower() in desc_sample.lower() and s.lower() not in resume_skills_lower]
            calc_score = min(95, max(40, int(len(matched) / (len(matched) + len(missing) + 1) * 100)))
            return {
                "match_score": calc_score,
                "matching_skills": matched[:6],
                "missing_skills": missing[:4],
                "reasoning": f"Candidate matches {len(matched)} relevant technologies mentioned in the job description."
            }

        try:
            model_id = self._get_model_id()
            llm = ChatGroq(
                model=model_id,
                api_key=api_key,
                temperature=0.1,
                max_tokens=600
            )

            chain = job_scoring_prompt | llm | JsonOutputParser()

            result = chain.invoke({
                "resume_skills": ", ".join(skills) if skills else "General Computer Science, Programming",
                "resume_role": role or "Software Developer",
                "resume_location": city or "Pakistan",
                "resume_summary": summary or "Computer Science student / graduate",
                "job_title": job.get("title", ""),
                "job_company": job.get("organization", ""),
                "job_location": job.get("work_arrangement", "Pakistan"),
                "job_description": desc_sample
            })

            if isinstance(result, dict):
                score = int(result.get("match_score", 65))
                score = min(100, max(0, score))
                exp_detected = result.get("experience_required")
                
                response_dict = {
                    "match_score": score,
                    "matching_skills": result.get("matching_skills", []),
                    "missing_skills": result.get("missing_skills", []),
                    "reasoning": str(result.get("reasoning", ""))
                }

                if exp_detected and exp_detected.lower() != "not specified":
                    response_dict["experience_level"] = exp_detected

                return response_dict

        except Exception as e:
            print(f"[JobDiscoveryAgent] LLM scoring exception: {e}")

        return {
            "match_score": 55,
            "matching_skills": [s for s in skills if s.lower() in desc_sample.lower()][:4],
            "missing_skills": [],
            "reasoning": "Evaluated based on profile skills matching job requirements."
        }
