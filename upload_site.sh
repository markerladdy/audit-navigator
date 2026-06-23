#!/bin/bash
# Upload site to Cloudflare Pages via direct upload
TK=$(cat "/c/Users/MuMa Studio/.cf_token")
ACC_ID="be25ba83fb3a7d2a721187c12f1532c5"

# First, list existing files to understand the project structure
echo "=== Checking project ==="
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACC_ID}/pages/projects/audit-navigator" \
  -H "Authorization: Bearer *** | head -c 1000

echo ""
echo "=== Checking if deployment via upload works ==="
# Try direct upload with zip
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/${ACC_ID}/pages/projects/audit-navigator/deployments" \
  -H "Authorization: Bearer *** \
  -F 'manifest={"index.html":"1"}' \
  -F "1=@/tmp/site.tar.gz;filename=site.tar.gz"
