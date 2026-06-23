#!/bin/bash
TK=$(cat "/c/Users/MuMa Studio/.cf_token")
ACC="be25ba83fb3a7d2a721187c12f1532c5"
P="Authorization: Bearer "
H="${P}${TK}"

echo "=== Project ==="
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACC}/pages/projects/audit-navigator" -H "${H}" | head -c 1500
