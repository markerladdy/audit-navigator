#!/bin/bash
# Decode then deploy
TK=$(echo "Y2Z1dF9kQUZHS2hMNjY1NVJKYVBuTjR1U3o5V1d5aHNmN0NyUFo1amtGMDNQMDE3NDc1NDI=" | base64 -d)
ACC="be25ba83fb3a7d2a721187c12f1532c5"

curl -s "https://api.cloudflare.com/client/v4/accounts/${ACC}/pages/projects/audit-navigator/deployments?per_page=1" \
  -H "Authorization: Bearer *** | head -c 2000