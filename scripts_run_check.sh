#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
cd backend
node --check src/server.js
node --check src/controllers/index.js
cd ../frontend/js
node --check app.js

echo "Syntax checks passed."
