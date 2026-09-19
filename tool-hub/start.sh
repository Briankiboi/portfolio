#!/usr/bin/env bash
# DM Solution Technologies Toolkits — launcher
# Serves the offline tools hub on http://localhost:8080/
set -e
cd "$(dirname "$0")"
PORT="${1:-8080}"
if command -v python3 >/dev/null 2>&1; then
    echo "Serving DM Solution Technologies Toolkits at  http://localhost:${PORT}/   (Ctrl+C to stop)"
    exec python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v php >/dev/null 2>&1; then
    echo "Serving DM Solution Technologies Toolkits at  http://localhost:${PORT}/   (Ctrl+C to stop)"
    exec php -S "127.0.0.1:${PORT}"
else
    echo "ERROR: need python3 or php to run a local server." >&2
    exit 1
fi
