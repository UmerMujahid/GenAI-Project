import json
import requests

RAPIDAPI_KEY = "6e0040114fmsh3b03e147ef4840cp1560d1jsnfa29bf0d6128"

print("="*80)
print("CALLING ACTIVE JOBS DB API (1 SINGLE REQUEST)")
print("="*80)

url = "https://active-jobs-db.p.rapidapi.com/active-ats"
headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "active-jobs-db.p.rapidapi.com"
}
params = {
    "time_frame": "7d",
    "limit": "1"
}

r = requests.get(url, headers=headers, params=params, timeout=15)
print(f"Status Code: {r.status_code}")
if r.status_code == 200:
    data = r.json()
    print("\n--- COMPLETE RAW JSON RESPONSE FROM ACTIVE JOBS DB ---")
    print(json.dumps(data, indent=2))
else:
    print(f"Error: {r.text}")
