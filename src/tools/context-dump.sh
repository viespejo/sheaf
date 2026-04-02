#!/usr/bin/env bash
# context-dump.sh — generates a codebase snapshot for LLM sessions
# Usage: bash path/to/context-dump.sh [--profile node|python|go] [--include file] [--out file.md]

set -euo pipefail

# ── ARGS ──────────────────────────────────────────────────────────────────────
PROFILE=""
OUT=""
EXTRA_FILES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile) PROFILE="$2";                  shift 2 ;;
    --out)     OUT="$2";                      shift 2 ;;
    --include) EXTRA_FILES+=("$2");           shift 2 ;;
    *) echo "Unknown option: $1" >&2;         exit 1  ;;
  esac
done

# ── AUTO-DETECT PROFILE ───────────────────────────────────────────────────────
if [[ -z "$PROFILE" ]]; then
  if [[ -f package.json ]];    then PROFILE="node"
  elif [[ -f go.mod ]];        then PROFILE="go"
  elif [[ -f pyproject.toml || -f setup.py || -f requirements.txt ]]; then PROFILE="python"
  else
    echo "Could not detect profile. Use --profile node|python|go" >&2
    exit 1
  fi
fi

echo "▶ Profile: $PROFILE" >&2

# ── READ .contextdump ─────────────────────────────────────────────────────────
# Format: one path per line, empty lines and comments (#) are ignored
CONFIGFILE=".contextdump"
CONFIG_FILES=()

if [[ -f "$CONFIGFILE" ]]; then
  echo "▶ Reading $CONFIGFILE" >&2
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
    CONFIG_FILES+=("$line")
  done < "$CONFIGFILE"
fi

# Merge: .contextdump files + --include flags (no duplicates)
declare -A _seen
ALL_EXTRA=()
for f in "${CONFIG_FILES[@]}" "${EXTRA_FILES[@]}"; do
  [[ -n "${_seen[$f]:-}" ]] && continue
  _seen[$f]=1
  ALL_EXTRA+=("$f")
done

# ── HELPERS ───────────────────────────────────────────────────────────────────
OUTPUT=""
emit()     { OUTPUT+="$1"$'\n'; }
emit_file() {
  local f="$1" lang="${2:-}"
  [[ -f "$f" ]] || { echo "  ⚠ Not found: $f" >&2; return 0; }
  emit "#### $f"
  emit '````'"$lang"
  emit "$(cat "$f")"
  emit '````'
  emit ""
}

# Infers code block language from file extension
lang_for() {
  case "${1##*.}" in
    ts|tsx)        echo "typescript" ;;
    js|jsx|mjs)    echo "javascript" ;;
    py)            echo "python"     ;;
    go)            echo "go"         ;;
    json)          echo "json"       ;;
    toml)          echo "toml"       ;;
    yaml|yml)      echo "yaml"       ;;
    md)            echo "markdown"   ;;
    sh|bash)       echo "bash"       ;;
    *)             echo ""           ;;
  esac
}

# ── COMMON: PROJECT STRUCTURE ─────────────────────────────────────────────────
emit "### Project Structure"
emit '````'
emit "$(
if git rev-parse --git-dir > /dev/null 2>&1; then
  # Tracked files + untracked non-ignored files
  { git ls-files; git ls-files --others --exclude-standard; } \
    | sort -u \
    | tree --fromfile --dirsfirst 2>/dev/null || cat
else
  echo "(not a git repo — falling back to find)"
  find . -not \( -path '*/node_modules/*' -o -path '*/.git/*' \
    -o -path '*/dist/*' -o -path '*/build/*' -o -path '*/__pycache__/*' \
    -o -path '*/.venv/*' \) | sort | head -80
fi
)"
emit '````'
emit ""

# ── COMMON: RECENTLY MODIFIED ─────────────────────────────────────────────────
emit "### Recently Modified (top 10)"
emit '````'
emit "$(
if git rev-parse --git-dir > /dev/null 2>&1; then
  git log --pretty=format: --name-only -n 50 2>/dev/null \
    | grep -E '\.(ts|js|go|py|json|toml|yaml|yml)$' \
    | grep -v 'node_modules\|dist\|build\|__pycache__' \
    | sort | uniq -c | sort -rn \
    | head -10 | awk '{print $2}'
else
  echo "git not available"
fi
)"
emit '````'
emit ""

# ── PROFILES ──────────────────────────────────────────────────────────────────

profile_node() {
  emit "### Stack"
  emit_file "package.json" "json"

  emit "### Config Files"
  for f in tsconfig.json tsconfig.base.json .eslintrc.js .eslintrc.json \
            prettier.config.js prettier.config.ts \
            vitest.config.ts vitest.config.js \
            jest.config.ts jest.config.js; do
    emit_file "$f"
  done

  emit "### Entry Points"
  for f in src/index.ts src/main.ts src/app.ts index.ts main.ts app.ts; do
    emit_file "$f" "typescript"
  done

  emit "### Modules (src/ first-level)"
  if [[ -d src ]]; then
    for dir in src/*/; do
      [[ -d "$dir" ]] || continue
      module=$(basename "$dir")
      files=$(find "$dir" -maxdepth 1 -name '*.ts' | sort | xargs -I{} basename {} 2>/dev/null | tr '\n' '  ')
      emit "- **$module**: $files"
    done
  fi
  emit ""
}

profile_python() {
  emit "### Stack"
  for f in pyproject.toml setup.py setup.cfg requirements.txt requirements-dev.txt; do
    emit_file "$f" "toml"
  done

  emit "### Config Files"
  for f in .python-version mypy.ini .mypy.ini pyrightconfig.json \
            pytest.ini ruff.toml .ruff.toml; do
    emit_file "$f"
  done

  emit "### Entry Points"
  for f in main.py app.py run.py src/main.py src/app.py; do
    emit_file "$f" "python"
  done

  emit "### Modules (top-level packages)"
  for dir in */; do
    [[ -f "${dir}__init__.py" ]] || continue
    module=$(basename "$dir")
    [[ "$module" =~ ^(test|tests|\..*) ]] && continue
    files=$(find "$dir" -maxdepth 1 -name '*.py' | sort | xargs -I{} basename {} 2>/dev/null | tr '\n' '  ')
    emit "- **$module**: $files"
  done
  emit ""
}

profile_go() {
  emit "### Stack"
  emit_file "go.mod" "go"
  emit_file "go.sum" ""

  emit "### Config Files"
  for f in .golangci.yml .golangci.yaml Makefile docker-compose.yml; do
    emit_file "$f"
  done

  emit "### Entry Points"
  for f in main.go cmd/main.go; do
    emit_file "$f" "go"
  done
  if [[ -d cmd ]]; then
    for f in cmd/*/main.go; do
      emit_file "$f" "go"
    done
  fi

  emit "### Packages (top-level)"
  for dir in */; do
    [[ -d "$dir" ]] || continue
    module=$(basename "$dir")
    [[ "$module" =~ ^(vendor|\..*) ]] && continue
    gofiles=$(find "$dir" -maxdepth 1 -name '*.go' | sort | xargs -I{} basename {} 2>/dev/null | tr '\n' '  ')
    [[ -z "$gofiles" ]] && continue
    emit "- **$module**: $gofiles"
  done
  emit ""
}

# ── DISPATCH ──────────────────────────────────────────────────────────────────
case "$PROFILE" in
  node)   profile_node   ;;
  python) profile_python ;;
  go)     profile_go     ;;
  *)
    echo "Unknown profile: $PROFILE. Options: node, python, go" >&2
    exit 1
    ;;
esac

# ── EXTRA FILES (.contextdump + --include) ────────────────────────────────────
if [[ ${#ALL_EXTRA[@]} -gt 0 ]]; then
  emit "### Extra Files"
  for f in "${ALL_EXTRA[@]}"; do
    lang=$(lang_for "$f")
    emit_file "$f" "$lang"
  done
fi

# ── OUTPUT ────────────────────────────────────────────────────────────────────
if [[ -n "$OUT" ]]; then
  echo "$OUTPUT" > "$OUT"
  echo "✓ Context dump saved to: $OUT" >&2
else
  echo "$OUTPUT"
fi
