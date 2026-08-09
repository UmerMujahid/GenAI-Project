import json
import requests

RAPIDAPI_KEY = "6e0040114fmsh3b03e147ef4840cp1560d1jsnfa29bf0d6128"
url = "https://active-jobs-db.p.rapidapi.com/active-ats"
headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "active-jobs-db.p.rapidapi.com"
}

print("Testing search filters on Active Jobs DB active-ats:")
params_list = [
    {"time_frame": "7d", "title": "Developer", "limit": "5"},
    {"time_frame": "7d", "query": "Developer", "limit": "5"},
    {"time_frame": "7d", "search": "Software", "limit": "5"},
    {"time_frame": "7d", "category": "technology", "limit": "5"}
]

for p in params_list:
    r = requests.get(url, headers=headers, params=p, timeout=10)
    if r.status_code == 200:
        data = r.json()
        print(f"\nParam {p} -> Status: 200, Count: {len(data)}")
        if len(data) > 0:
            print(f"Sample Title: {data[0].get('title')}")
    else:
        print(f"\nParam {p} -> Status: {r.status_code}, Error: {r.text[:150]}")
