import asyncio
import json
import os
from dotenv import load_dotenv
from ai.agents.job_discovery_agent import JobDiscoveryAgent

load_dotenv("backend/.env")

async def main():
    print("="*80)
    print("MANUAL TEST: AGENT 2 (JOB DISCOVERY AGENT - ACTIVE JOBS DB)")
    print("="*80)

    groq_key = os.getenv("GROQ_API_KEY")
    rapidapi_key = os.getenv("RAPIDAPI_KEY")

    agent = JobDiscoveryAgent(groq_api_key=groq_key, rapidapi_key=rapidapi_key)

    # Mock candidate resume data (similar to parsed resume output from Agent 1)
    mock_resume = {
        "skills": ["Python", "FastAPI", "React", "TypeScript", "MongoDB", "Git"],
        "role_preference": "Software Engineer Intern",
        "city": "Pakistan",
        "summary": "Computer Science student specializing in Web APIs, Generative AI, and Full-Stack Development."
    }

    print(f"\n[Test] Resume Profile: {mock_resume['role_preference']} | Skills: {mock_resume['skills']}\n")
    print("Running Agent 2 Job Discovery (Fetching from Active Jobs DB with time_frame=7d)...\n")

    jobs = await agent.discover_jobs(mock_resume, max_results=3)

    print("\n" + "="*80)
    print(f"SUCCESSFULLY DISCOVERED AND SCORED {len(jobs)} INTERNSHIPS/JOBS:")
    print("="*80)

    for idx, job in enumerate(jobs, 1):
        print(f"\n--- JOB #{idx} ---")
        print(f"Title:                {job.get('title')}")
        print(f"Organization:         {job.get('organization')}")
        print(f"Match Score:          {job.get('match_score')}%")
        print(f"Work Arrangement:     {job.get('work_arrangement')}")
        print(f"Salary Range:         {job.get('salary_currency')} {job.get('salary_min')} - {job.get('salary_max')} / {job.get('salary_unit')}")
        print(f"Experience Level:     {job.get('experience_level')}")
        print(f"Visa Sponsorship:     {job.get('visa_sponsorship')}")
        print(f"Matching Skills:      {job.get('matching_skills')}")
        print(f"Missing Skills:       {job.get('missing_skills')}")
        print(f"Agent Reasoning:      {job.get('reasoning')}")
        print(f"Benefits:             {job.get('benefits')}")
        print(f"Apply Link:           {job.get('apply_url')}")

if __name__ == "__main__":
    asyncio.run(main())
