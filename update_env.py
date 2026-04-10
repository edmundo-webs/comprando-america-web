import urllib.request
import json
import os

token = os.environ.get("RENDER_API_KEY")
service_id = "srv-d6q84ovpm1nc73atm2og"
url = f"https://api.render.com/v1/services/{service_id}/env-vars"

req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}", "Accept": "application/json"})
with urllib.request.urlopen(req) as response:
    env_vars = json.loads(response.read().decode())

new_env = []
for item in env_vars:
    ev = item.get("envVar", item)
    key = ev["key"]
    val = ev["value"]
    if key == "DATABASE_URL":
        val = 'mysql://AiRZciX5MutALEJ.root:5u4xOYpHqxeOyJUb@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}'
    new_env.append({"key": key, "value": val})

req = urllib.request.Request(url, method="PUT", headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
req.data = json.dumps(new_env).encode()

try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.status)
except urllib.error.HTTPError as e:
    print("Error:", e.read().decode())
except Exception as e:
    print("Error:", e)
