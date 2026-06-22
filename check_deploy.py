import subprocess, json

f = open(r"C:\Users\MuMa Studio\.cf_token")
tk = f.read().strip()
f.close()

acc_id = "be25ba83fb3a7d2a721187c12f1532c5"
headers = [
    "-H", "Authorization: Bearer *** + tk,
    "-H", "Content-Type: application/json"
]

r = subprocess.run(["curl", "-s",
    "https://api.cloudflare.com/client/v4/accounts/%s/pages/projects/audit-navigator/deployments" % acc_id] + headers,
    capture_output=True, text=True, timeout=10)
d = json.loads(r.stdout)
if d.get("success") and d["result"]:
    dep = d["result"][0]
    print("Status: %s" % dep.get("status"))
    print("Created: %s" % dep.get("created_on", ""))
    print("URL: https://%s" % dep.get("url", "audit-navigator.pages.dev"))
    # Show latest 3
    for i, dep in enumerate(d["result"][:3]):
        print("Deploy %d: %s - %s" % (i+1, dep.get("status"), dep.get("deployment_trigger",{}).get("type","")))
else:
    print("Error: %s" % d)
