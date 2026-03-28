#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
ARCHIVE="$DIST_DIR/rasel-saas-project.tar.gz"

mkdir -p "$DIST_DIR"

tar \
  --exclude='.git' \
  --exclude='.venv' \
  --exclude='dist' \
  -czf "$ARCHIVE" \
  -C "$ROOT_DIR" .

echo "Exported project archive: $ARCHIVE"
