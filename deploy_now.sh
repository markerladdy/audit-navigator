#!/bin/bash
TK=$(cat "/c/Users/MuMa Studio/.cf_token")
ACC="be25ba83fb3a7d2a721187c12f1532c5"
P="Authorization: Bearer "
H="${P}${TK}"

echo "=== Creating deployment ==="
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/${ACC}/pages/projects/audit-navigator/deployments" \
  -H "${H}" \
  -F "manifest={\"index.html\":\"1\",\"hospital.html\":\"2\",\"education.html\":\"3\",\"news.html\":\"4\",\"cases.html\":\"5\",\"tools.html\":\"6\",\"about.html\":\"7\"}" \
  -F "1=@/c/Users/MuMa Studio/auditnavigator/index.html" \
  -F "2=@/c/Users/MuMa Studio/auditnavigator/hospital.html" \
  -F "3=@/c/Users/MuMa Studio/auditnavigator/education.html" \
  -F "4=@/c/Users/MuMa Studio/auditnavigator/news.html" \
  -F "5=@/c/Users/MuMa Studio/auditnavigator/cases.html" \
  -F "6=@/c/Users/MuMa Studio/auditnavigator/tools.html" \
  -F "7=@/c/Users/MuMa Studio/auditnavigator/about.html" | head -c 1000
