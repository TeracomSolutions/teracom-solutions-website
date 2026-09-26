#!/usr/bin/env bash
# Apply the admin console changes to the website checkout on VM 101, then
# test and build. Stops at the first failure. Expects /tmp/wi-frontend.
set -euo pipefail

cd /home/teracom/teracom-solutions-website

if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm use >/dev/null
fi
node --version

echo "== branch"
git branch --show-current

echo "== apply"
python3 /tmp/wi-frontend/apply_frontend.py

echo "== test"
npm test 2>&1 | tail -15

echo "== build"
npm run build 2>&1 | tail -40
