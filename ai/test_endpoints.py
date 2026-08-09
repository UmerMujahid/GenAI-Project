import json
import requests

RAPIDAPI_KEY = "6e0040114fmsh3b03e147ef4840cp1560d1jsnfa29bf0d6128"

print("--- TESTING JSEARCH ENDPOINTS ---")
jsearch_headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com"
}
res = requests.get("https://jsearch.p.rapidapi.com/search", headers=jsearch_headers, params={"query": "Python Pakistan"}, timeout=10)
print(f"JSearch /search: {res.status_code} - {res.text[:200]}")

print("\n--- TESTING ACTIVE JOBS DB ENDPOINTS ---")
active_hosts = [
    "active-jobs-db.p.rapidapi.com",
    "active-jobs-db1.p.rapidapi.com"
]

endpoints = [
    "https://active-jobs-db.p.rapidapi.com/active-ats",
    "https://active-jobs-db.p.rapidapi.com/jobs",
    "https://active-jobs-db.p.rapidapi.com/active-jobs",
    "https://active-jobs-db.p.rapidapi.com/search"
]

for url in endpoints:
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "active-jobs-db.p.rapidapi.com"
    }
    r = requests.get(url, headers=headers, params={"limit": "1"}, timeout=10)
    print(f"Active Jobs DB ({url}): {r.status_code} - {r.text[:200]}")
