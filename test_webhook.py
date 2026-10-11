import re, requests, json

c = open('g:/KDDT/website/assets/js/data.js', encoding='utf-8').read()
url = re.search(r"const SUPABASE_URL = ['\"](.*?)['\"]", c).group(1)
key = re.search(r"const SUPABASE_KEY = ['\"](.*?)['\"]", c).group(1)

endpoint = f"{url}/rest/v1/rpc/sepay_webhook"
headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

payload = {
    "id": 99999999,
    "gateway": "TEST",
    "transactionDate": "2023-10-10 10:00:00",
    "accountNumber": "TEST",
    "code": "TEST",
    "content": "Thanh toan PV1791644161873",
    "transferType": "in",
    "transferAmount": 10000,
    "accumulated": 10000
}

r = requests.post(endpoint, headers=headers, json=payload)
print("Status Code:", r.status_code)
print("Response:", r.text)
