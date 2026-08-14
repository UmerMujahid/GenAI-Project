import asyncio
import os
from dotenv import load_dotenv
from ai.agents.job_discovery_agent import JobDiscoveryAgent

load_dotenv("backend/.env")

async def main():
    print("="*80)
    print("MANUAL TEST: AGENT 2 (JOBSPY UNLIMITED SCRAPER - INDEED / LINKEDIN / GOOGLE JOBS)")
    print("="*80)

    groq_key = os.getenv("GROQ_API_KEY")

    agent = JobDiscoveryAgent(groq_api_key=groq_key)

    mock_resume = {
        "skills": ["Python", "FastAPI", "React", "TypeScript", "MongoDB", "Git"],
        "role_preference": "Software Developer Internship",
        "city": "Pakistan",
        "summary": "Computer Science student specializing in Web APIs, Generative AI, and Full-Stack Development."
    }

    print(f"\n[Test] Candidate Skills: {mock_resume['skills']}")
    print("Scraping real-time jobs in Pakistan via JobSpy (Indeed + LinkedIn + Google Jobs)...\n")

    jobs = await agent.discover_jobs(mock_resume, max_results=5)

    print("\n" + "="*80)
    print(f"SUCCESSFULLY DISCOVERED AND SCORED {len(jobs)} REAL INTERNSHIPS/JOBS:")
    print("="*80)

    for idx, job in enumerate(jobs, 1):
        print(f"\n--- JOB #{idx} ---")
        print(f"Title:                {job.get('title')}")
        print(f"Organization:         {job.get('organization')}")
        print(f"Source Platform:      {job.get('source_platform')}")
        print(f"Match Score:          {job.get('match_score')}%")
        print(f"Work Arrangement:     {job.get('work_arrangement')}")
        print(f"Date Posted:          {job.get('date_posted')}")
        print(f"Matching Skills:      {job.get('matching_skills')}")
        print(f"Missing Skills:       {job.get('missing_skills')}")
        print(f"Agent Reasoning:      {job.get('reasoning')}")
        print(f"Apply Link:           {job.get('apply_url')}")

if __name__ == "__main__":
    asyncio.run(main())
