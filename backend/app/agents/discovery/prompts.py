from langchain.prompts import PromptTemplate#type:ignore

job_discovery_template = """
You are an expert Job Discovery Agent. Your task is to extract exact search query parameters for web scraping job portals.

User Input:
- Target Role: {role}
- Required Skills: {skills}
- Location: {city}
- Work Type: {work_type}

Output MUST be a valid JSON object with EXACTLY these keys: "search_query", "location", and "job_type".
Do not include any extra text, conversational fillers, or markdown formatting outside of the JSON block.

Example Output:
{{
  "search_query": "Software Engineer Intern Python React",
  "location": "Lahore",
  "job_type": "Remote"
}}
"""

discovery_prompt = PromptTemplate(
    input_variables=["role", "skills", "city", "work_type"],
    template=job_discovery_template
)

def generate_discovery_prompt(role: str, skills: str, city: str, work_type: str) -> str:
    return discovery_prompt.format(role=role, skills=skills, city=city, work_type=work_type)