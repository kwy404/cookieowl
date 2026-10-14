#!/usr/bin/env bash
# Renders the social preview and the Open Graph image with Edge headless.
set -euo pipefail
cd "$(dirname "$0")/.."
EDGE="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
ROOT="$(pwd -W 2>/dev/null || pwd)"
render() {
  timeout 60 "$EDGE" --headless=new --disable-gpu --hide-scrollbars --window-size="$2" \
    --screenshot="$ROOT/$1" "file:///$ROOT/scripts/templates/card.html" 2>/dev/null || true
  echo "rendered $1"
}
render assets/social-preview.png 1280,640
render docs/og.png 1200,630
