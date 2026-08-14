import json
import pandas as pd
from jobspy import scrape_jobs

print("Testing python-jobspy scraping for Pakistan...")

try:
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "google"],
        search_term="Software Developer Internship",
        location="Pakistan",
        results_wanted=5,
        hours_old=720,  # last 30 days
        country_indeed="Pakistan"
    )

    print(f"\nFound {len(jobs)} jobs via JobSpy!")
    if not jobs.empty:
        print("\n--- COLUMNS RETURNED BY JOBSPY ---")
        print(list(jobs.columns))
        print("\n--- SAMPLE ITEM 1 ---")
        sample_dict = jobs.iloc[0].to_dict()
        # Convert non-serializable objects to str
        for k, v in sample_dict.items():
            if pd.isna(v):
                sample_dict[k] = None
            elif not isinstance(v, (str, int, float, bool, list, dict)):
                sample_dict[k] = str(v)
        print(json.dumps(sample_dict, indent=2))
    else:
        print("No jobs returned.")

except Exception as e:
    print(f"JobSpy Exception: {e}")
