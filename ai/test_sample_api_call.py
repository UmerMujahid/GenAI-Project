import json
import requests
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "6e0040114fmsh3b03e147ef4840cp1560d1jsnfa29bf0d6128")

print("="*80)
print("1. CALLING JSEARCH API (1 SINGLE REQUEST)")
print("="*80)

jsearch_url = "https://jsearch.p.rapidapi.com/search"
jsearch_headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com"
}
jsearch_params = {
    "query": "Python Developer internship Pakistan",
    "page": "1",
    "num_pages": "1"
}

try:
    res = requests.get(jsearch_url, headers=jsearch_headers, params=jsearch_params, timeout=15)
    print(f"JSearch Status Code: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print("\n--- RAW JSEARCH RESPONSE KEYS ---")
        print(list(data.keys()))
        if "data" in data and len(data["data"]) > 0:
            print("\n--- SAMPLE ITEM 1 FROM JSEARCH ---")
            print(json.dumps(data["data"][0], indent=2))
        else:
            print("No jobs found in data array.")
            print(json.dumps(data, indent=2))
    else:
        print(f"Error: {res.text}")
except Exception as e:
    print(f"JSearch Exception: {e}")


print("\n" + "="*80)
print("2. CALLING ACTIVE JOBS DB API (1 SINGLE REQUEST)")
print("="*80)

active_url = "https://active-jobs-db.p.rapidapi.com/active-ats-7d"
active_headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "active-jobs-db.p.rapidapi.com"
}
active_params = {
    "title": "Developer",
    "location": "Pakistan",
    "limit": "1"
}

try:
    res2 = requests.get(active_url, headers=active_headers, params=active_params, timeout=15)
    print(f"Active Jobs DB Status Code: {res2.status_code}")
    if res2.status_code == 200:
        data2 = res2.json()
        print("\n--- SAMPLE ITEM 1 FROM ACTIVE JOBS DB ---")
        if isinstance(data2, list) and len(data2) > 0:
            print(json.dumps(data2[0], indent=2))
        elif isinstance(data2, dict):
            print(json.dumps(data2, indent=2))
        else:
            print(json.dumps(data2, indent=2))
    else:
        print(f"Error: {res2.text}")
except Exception as e:
    print(f"Active Jobs DB Exception: {e}")
