import subprocess, json, os

h = {"Authorization": "Bearer *** os.environ.get("CF_TOKEN", "").strip(), "Content-Type": "application/json"}

r = subprocess.run(["curl", "-s", 
    "https://api.cloudflare.com/client/v4/accounts/be25ba83fb3a7d2a721187c12f1532c5/pages/projects/audit-navigator"],
    capture_output=True, text=True, timeout=10)
d = json.loads(r.stdout)
if d.get("success"):
    result = d["result"]
    print("Domains: %s" % result.get("domains", []))
    print("Latest deployment: %s" % result.get("latest_deployment", {}).get("status", "none"))
else:
    print("Error: %s" % d.get("errors", [{}])[0].get("message", ""))
