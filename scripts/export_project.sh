#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/dist"
OUT_FILE="$OUT_DIR/rasel-full-project.tar.gz"

mkdir -p "$OUT_DIR"

tar \
  --exclude=".git" \
  --exclude=".pytest_cache" \
  --exclude="__pycache__" \
  --exclude="*.pyc" \
  -czf "$OUT_FILE" \
  -C "$ROOT_DIR" .

echo "Export created: $OUT_FILE"
