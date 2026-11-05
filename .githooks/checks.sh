#!/usr/bin/env bash
# Local checks for every commit and push (there is no GitHub CI).
#   .githooks/checks.sh commit   suites touched by the staged changes
#   .githooks/checks.sh push     every suite, on a clean tree
#   .githooks/checks.sh all|web|build|secrets
# Skip once with git commit/push --no-verify.
set -euo pipefail
root=$(git rev-parse --show-toplevel)
cd "$root"

web() { npm run typecheck && npm run lint && npm test; }
# The production bundle, which calls api.mistysys.com unless told otherwise.
build() { NODE_OPTIONS=--max-old-space-size=4096 npm run build; }
gitleaks_image=zricethezav/gitleaks@sha256:e1b35e12a8c6fa8901f060459cfb6b2fc4c484d3afbe3b029733a3bbfab07055
# Scans commits, never the working folder: git-ignored .env files stay out.
# On push, only the commits the remote does not have yet.
secrets() {
  local range=HEAD
  if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null); then
    range="$upstream..HEAD"
  fi
  [ -z "$(git rev-list "$range" 2>/dev/null | head -n 1)" ] && { echo "No new commits to scan."; return 0; }
  docker run --rm -v "$root:/repo:ro" -e GIT_CONFIG_COUNT=1 -e GIT_CONFIG_KEY_0=safe.directory \
    -e GIT_CONFIG_VALUE_0=/repo "$gitleaks_image" detect --source=/repo --redact --log-opts="$range"
}
staged_secrets() {
  docker run --rm -v "$root:/repo:ro" -w /repo -e GIT_CONFIG_COUNT=1 -e GIT_CONFIG_KEY_0=safe.directory \
    -e GIT_CONFIG_VALUE_0=/repo "$gitleaks_image" protect --staged --source=/repo --redact
}

run() {
  local name=$1 started=$SECONDS
  echo "── $name"
  if ! "${name//-/_}"; then
    echo "✗ $name failed. Fix it, or skip once with --no-verify." >&2
    exit 1
  fi
  echo "✓ $name ($((SECONDS - started))s)"
}

case "${1:-}" in
  commit)
    run staged-secrets
    if git diff --cached --name-only --diff-filter=ACMRD |
      grep -qE '^(src|tests|public|scripts)/|^(package(-lock)?\.json|tsconfig.*\.json|vite\.config\.ts|vitest\.config\.ts|eslint\.config\.js|index\.html)$'; then
      run web
    else
      echo "No test suites affected."
    fi
    ;;
  push)
    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "Commit or discard local changes before pushing; checks must run on the pushed commit." >&2
      exit 1
    fi
    run secrets
    run web
    run build
    ;;
  all) run secrets; run web; run build ;;
  web | build | secrets) run "$1" ;;
  *) echo "Usage: .githooks/checks.sh commit|push|all|web|build|secrets" >&2; exit 2 ;;
esac
