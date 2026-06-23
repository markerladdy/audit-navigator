import json, subprocess, os, zlib

token_file = r"C:\Users\MuMa Studio\.cf_token"
with open(token_file) as f:
    token = f.read().strip()

project_dir = r"C:\Users\MuMa Studio\auditnavigator"
acc_id = "be25ba83fb3a7d2a721187c12f1532c5"

# Check deployments
r = subprocess.run([
    "curl", "-s",
    f"https://api.cloudflare.com/client/v4/accounts/{acc_id}/pages/projects/audit-navigator/deployments",
    "-H", f"Authorization: Bearer ***     "-H", "Content-Type: application/json"
], capture_output=True, text=True, timeout=10)

d = json.loads(r.stdout)
if d.get("success"):
    if d["result"]:
        for dep in d["result"][:2]:
            print(f"Deploy: {dep['id']} = {dep['status']}")
            print(f"  URL: {dep.get('url', 'N/A')}")
    else:
        print("No deployments exist - project needs initial deploy")
else:
    print(f"API Error: {d.get('errors', [{}])[0].get('message', 'unknown')}")
