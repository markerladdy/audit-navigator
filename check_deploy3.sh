#!/bin/bash
TK=$(cat "/c/Users/MuMa Studio/.cf_token")
ACC="be25ba83fb3a7d2a721187c12f1532c5"
P="Authorization: Bearer "
H=...echo "=== Latest deployment ==="
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACC}/pages/projects/audit-navigator/deployments?per_page=1" -H "${H}" | python -c "
import json,sys
d = json.load(sys.stdin)
if d.get('result'):
    dep = d['result'][0]
    print('ID:', dep['id'])
    print('Status:', dep.get('status','?'))
    print('URL:', dep.get('url',''))
    print('Latest stage:', dep.get('latest_stage',{}))
    for s in dep.get('stages',[]):
        print('Stage %s: %s' % (s['name'], s['status']))
"
