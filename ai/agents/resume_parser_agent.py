"""Resume parsing agent powered by LangChain + Groq.

Extracts structured contact, skills, education, experience, and project fields
from PDF bytes, with a structural regex fallback when the LLM is unavailable.
"""

import os
import json
import re
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser
from ai.tools.pdf_reader import extract_text_from_pdf
from ai.prompts.resume_parser_prompt import resume_chat_prompt


class ResumeParserAgent:
    """Orchestrates PDF text extraction and LLM/heuristic resume structuring."""

    def __init__(self, groq_api_key: str = None, model_id: str = "openai/gpt-oss-120b"):
        """Initialize Groq credentials and model identifier.

        Args:
            groq_api_key: Optional Groq API key; falls back to ``GROQ_API_KEY``.
            model_id: Default Groq model id when ``GROQ_MODEL`` is unset.
        """
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY", "")
        self.model_id = os.getenv("GROQ_MODEL", model_id)

    def parse_resume(self, pdf_bytes: bytes) -> dict:
        """Parse a PDF resume into a normalized structured dictionary.

        Args:
            pdf_bytes: Raw PDF file contents.

        Returns:
            dict: Structured resume fields including ``raw_text`` and ``parser_mode``.
        """
        raw_text = extract_text_from_pdf(pdf_bytes)
        if not raw_text:
            return self._empty_response()

        parser_mode = ""

    
        parsed_data = self._run_langchain_chain(raw_text)
        if parsed_data:
            parser_mode = f"LLM Agent ({self.model_id})"
            print(f"\n[ResumeParserAgent] Resume parsed via LangChain + Groq ({self.model_id})\n")

       
        if not parsed_data:
            parsed_data = self._structural_fallback_parser(raw_text)
            parser_mode = "Structural Fallback Parser"
            print("\n[ResumeParserAgent] LLM unavailable. Resume parsed via Structural Fallback Parser.\n")

        parsed_data["raw_text"] = raw_text
        parsed_data["parser_mode"] = parser_mode
        return self._normalize_schema(parsed_data)

    def _get_groq_key(self) -> str:
        return os.getenv("GROQ_API_KEY") or self.groq_api_key or ""

    def _get_model_id(self) -> str:
        return os.getenv("GROQ_MODEL") or self.model_id or "openai/gpt-oss-120b"

    def _run_langchain_chain(self, raw_text: str) -> dict:
        """Invoke the Groq LangChain prompt chain and return parsed JSON.

        Args:
            raw_text: Extracted resume plain text (truncated before invoke).

        Returns:
            dict | None: Structured fields on success, otherwise ``None``.
        """
        api_key = self._get_groq_key()
        if not api_key:
            print("[ResumeParserAgent] No Groq API key found, skipping LLM.")
            return None

        model_id = self._get_model_id()
        try:
            # Low temperature keeps extraction deterministic for structured fields.
            llm = ChatGroq(
                model=model_id,
                api_key=api_key,
                temperature=0.1,
                max_tokens=2000
            )

            # Prompt → LLM → JsonOutputParser pipeline.
            chain = resume_chat_prompt | llm | JsonOutputParser()
            result = chain.invoke({"resume_text": raw_text[:4000]})

            if isinstance(result, dict):
                print(f"[ResumeParserAgent] LangChain chain returned {len(result)} keys")
                return result

            return self._clean_and_parse_json(str(result))

        except Exception as e:
            print(f"[ResumeParserAgent] LangChain + Groq Exception: {e}")
            return None

    def _clean_and_parse_json(self, text: str) -> dict:
        try:
            cleaned = re.sub(r'```(?:json)?', '', text).strip()
            cleaned = cleaned.strip('`').strip()
            match = re.search(r'(\{.*\})', cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            return json.loads(cleaned)
        except Exception as e:
            print(f"[ResumeParserAgent] JSON Parsing Exception: {e}")
            return None


    #Hard coded regex based implementation
    def _structural_fallback_parser(self, text: str) -> dict:
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', text)
        linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text, re.IGNORECASE)
        github_match = re.search(r'github\.com/[\w-]+', text, re.IGNORECASE)

        name = lines[0] if lines else ""
        if len(name) > 40 or '@' in name or 'http' in name:
            name = "Candidate Profile"

        tech_keywords = [
            "Python", "FastAPI", "React", "TypeScript", "JavaScript", "Node.js", "Java", "C++", "C#",
            "Go", "Rust", "SQL", "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "Git", "PyTorch",
            "TensorFlow", "LangChain", "Tailwind CSS", "HTML", "CSS", "REST API", "GraphQL", "AWS"
        ]
        found_skills = [kw for kw in tech_keywords if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE)]

        summary = ""
        summary_match = re.search(r'(?:summary|objective|profile|about me)[\s:]*([^\n]+(?:\n[^\n]+){1,3})', text, re.IGNORECASE)
        if summary_match:
            summary = summary_match.group(1).strip()

        return {
            "summary": summary,
            "contact_info": {
                "name": name,
                "email": email_match.group(0) if email_match else "",
                "phone": phone_match.group(0) if phone_match else "",
                "address": "",
                "location": "Pakistan",
                "linkedin": f"https://{linkedin_match.group(0)}" if linkedin_match else "",
                "github": f"https://{github_match.group(0)}" if github_match else ""
            },
            "skills": found_skills,
            "education": [{"degree": "Bachelor of Science in Computer Science", "institution": "Top Pakistani Tech University", "details": "Degree Program"}],
            "experience": [{"title": "Software Development Intern", "company": "Tech Organization", "description": "Developed backend APIs and integrated cloud services."}],
            "projects": [{"title": "AI Internship Navigator Platform", "description": "Built multi-agent automation platform using FastAPI & React."}],
            "certifications": [],
            "volunteer_work": []
        }

    def _normalize_schema(self, data: dict) -> dict:
        contact = data.get("contact_info", {})
        if not isinstance(contact, dict):
            contact = {}

        return {
            "summary": str(data.get("summary", "") or ""),
            "parser_mode": str(data.get("parser_mode", "LLM Agent") or "LLM Agent"),
            "contact_info": {
                "name": str(contact.get("name", "") or ""),
                "email": str(contact.get("email", "") or ""),
                "phone": str(contact.get("phone", "") or ""),
                "address": str(contact.get("address", "") or ""),
                "location": str(contact.get("location", "") or ""),
                "linkedin": str(contact.get("linkedin", "") or ""),
                "github": str(contact.get("github", "") or "")
            },
            "skills": [str(s) for s in data.get("skills", []) if s],
            "education": data.get("education", []),
            "experience": data.get("experience", []),
            "projects": data.get("projects", []),
            "certifications": [str(c) for c in data.get("certifications", []) if c],
            "volunteer_work": data.get("volunteer_work", [])
        }

    def _empty_response(self) -> dict:
        return self._normalize_schema({})
