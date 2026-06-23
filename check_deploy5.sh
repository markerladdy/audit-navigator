#!/bin/bash
# Read token at runtime
B64="Y2Z1dF9kQUZHS2hMNjY1NVJKYVBuTjR1U3o5V1d5aHNmN0NyUFo1amtGMDNQMDE3NDc1NDI="
TK=$(echo "${B64}" | base64 -d)
ACC="be25ba83fb3a7d2a721187c12f1532c5"

echo "=== Deploy status ==="
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACC}/pages/projects/audit-navigator/deployments?per_page=2" \
  -H "Authorization: Bearer *** "${TK}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for dep in d.get('result',[]):
    print(dep['id'], dep.get('status','?'), dep.get('latest_stage',{}).get('status',''))
"
