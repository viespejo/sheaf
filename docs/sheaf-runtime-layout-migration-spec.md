# SHEAF Runtime Layout Migration Spec

**Date:** 2026-04-05  
**Status:** Approved design  
**Type:** Breaking change (pre-adoption)

## 1) Objective

Move from per-runtime duplicated assets:

- `./.codecompanion/sheaf/...` (legacy)
- `./.claude/sheaf/...` (legacy)
- `./.gemini/sheaf/...` (legacy)

To one shared runtime asset directory:

- `./.sheaf-runtime/...` (local scope)
- `<absolute-install-dir>/.sheaf-runtime/...` (global scope)

Runtime command entrypoints remain runtime-specific.

---

## 2) Final Decisions (locked)

1. **Topology:** Hybrid model.
   - Shared runtime assets in one folder.
   - Runtime command files remain per runtime.
2. **Compatibility strategy:** **Breaking change**.
3. **Shared folder location:** Sibling of runtime folders under install root.
4. **Shared folder name:** **`.sheaf-runtime/`**.
5. **Token strategy:** Replace `{{RUNTIME_DIR}}` with **`{{SHEAF_RUNTIME_DIR}}`**.

6. **Token compatibility:** **Hard cut** (no legacy token support).
7. **Install write strategy:** Write shared assets **once per install run**.
8. **Command references:** Use `{{SHEAF_RUNTIME_DIR}}/...` directly.
9. **Migration tooling:** One-time bulk replacement may use `sed`.
10. **Preflight guard:** None (fail naturally if missing assets).
11. **Scope semantics:** Keep current behavior.
    - local => relative path
    - global => absolute path
12. **Single runtime install:** Still creates shared `.sheaf-runtime/`.
13. **Install roots in one run:** Single shared root only.
14. **Runtime command output locations:** unchanged.
15. **Legacy per-runtime `sheaf/` folders:** detect and **warn**, do not delete.

---

## 3) Target Filesystem Contracts

### 3.1 Local install (example)

```text
<project-root>/
  .sheaf-runtime/
    templates/
    workflows/
    references/
    skills/
    rules/
    tools/

  .codecompanion/
    prompts/sheaf/*.md

  .claude/
    commands/sheaf/*.md

  .gemini/
    commands/sheaf/*.toml
```

### 3.2 Global install (example)

```text
<installDir>/
  .sheaf-runtime/
    ...assets...

  .codecompanion/
    prompts/sheaf/*.md

  .claude/
    commands/sheaf/*.md

  .gemini/
    commands/sheaf/*.toml
```

---

## 4) Placeholder / Path Rewrite Contract

## 4.1 Placeholder

- Canonical placeholder: `{{SHEAF_RUNTIME_DIR}}`
- Legacy placeholder `{{RUNTIME_DIR}}` is invalid after migration.

## 4.2 Rewriting behavior

When composing prompts and copying markdown assets:

- **local scope:** `{{SHEAF_RUNTIME_DIR}}` -> `./.sheaf-runtime`
- **global scope:** `{{SHEAF_RUNTIME_DIR}}` -> `<absolute path to install root>/.sheaf-runtime`

No trailing slash is required in token substitution; path references in markdown should append paths as needed (`.../workflows/...`).

---

## 5) Installer Behavior (normative)

`bin/install.js` must implement this sequence:

1. Resolve config (scope, installDir, runtimes) as today.
2. Compute:
   - `sharedRuntimeDir = path.join(installDir, '.sheaf-runtime')`
   - `sheafRuntimePrefix = (scope === 'local') ? './.sheaf-runtime' : sharedRuntimeDir`
3. Build runtime command artifacts for each selected runtime:
   - Output locations unchanged (`prompts/sheaf` or `commands/sheaf`).
   - During compose, replace `{{SHEAF_RUNTIME_DIR}}` using `sheafRuntimePrefix`.
4. Copy shared asset directories **once** into `.sheaf-runtime/`:
   - `templates`, `workflows`, `references`, `skills`, `rules`, `tools`
   - Apply same token replacement in copied markdown files.
5. Mark `tools/*.sh` executable in shared folder.
6. Legacy detection/warning:
   - If `<runtimeDir>/sheaf` exists, print warning:
     - legacy folder detected
     - no longer used
     - safe to remove manually

No automatic deletion.

---

## 6) Runtime Adapter Contract

`src/runtimes/index.js` and `src/runtimes/gemini.js` keep current runtime output policy:

- CodeCompanion: markdown command outputs
- Claude: markdown command outputs
- Gemini: TOML command outputs from composed markdown

No change in adapter API required unless install pipeline adds explicit shared-prefix parameter; if so, keep adapter interface stable or update consistently.

---

## 7) Required Source Edits

## 7.1 Token migration (repository-wide)

Replace every `{{RUNTIME_DIR}}` reference with `{{SHEAF_RUNTIME_DIR}}` in:

- `src/**/*.md`
- `bin/install.js` constants/replacement regex seed
- `bin/fix-skill-paths.js`
- docs mentioning old token (README, architecture docs, references/rules)

### One-time command (GNU/Linux)

```bash
find src bin docs -type f \( -name "*.md" -o -name "*.js" \) -print0 | xargs -0 sed -i 's/{{RUNTIME_DIR}}/{{SHEAF_RUNTIME_DIR}}/g'
```

Validation:

```bash
grep -R "{{RUNTIME_DIR}}" src bin docs README.md QUICKSTART.md || true
```

Expected: no matches.

## 7.2 `bin/fix-skill-paths.js`

Update hardcoded prefix from:

- `{{RUNTIME_DIR}}/sheaf/skills/`

to:

- `{{SHEAF_RUNTIME_DIR}}/skills/`

Rationale: skills now live under shared `.sheaf-runtime/skills/...`.

## 7.3 `bin/install.js`

Key edits:

1. Replace token constant:
   - `DOCS_DEFAULT_ROOT = '{{SHEAF_RUNTIME_DIR}}'`
2. Compute shared dir/prefix once.
3. Use `sheafRuntimePrefix` for token replacement in:
   - composed command prompts
   - copied markdown assets
4. Move shared asset copy out of runtime loop (once/run).
5. Change shared destination from `<runtime>/sheaf` to `<installDir>/.sheaf-runtime`.
6. Add legacy folder warning check in runtime loop.

---

## 8) Documentation Updates

Update all user-facing docs to reflect new layout and paths:

1. `README.md`
   - “What gets installed” section
   - context-dump script paths
   - token/path rewriting explanation
2. `docs/architecture.md`
   - runtime adapter output + shared assets lane
   - path rewriting contract with `{{SHEAF_RUNTIME_DIR}}`
3. `QUICKSTART.md` and any runtime usage examples
4. `src/rules/*.md` and `src/references/*.md` token mentions

---

## 9) Implementation Task List (ordered)

1. **Bulk token rename** (`{{RUNTIME_DIR}}` -> `{{SHEAF_RUNTIME_DIR}}`).
2. **Refactor installer constants and path rewrite seed**.
3. **Refactor installer write topology** (shared copy once, command outputs unchanged).
4. **Add legacy `.../sheaf` warning logic**.
5. **Update `bin/fix-skill-paths.js` prefix contract**.
6. **Refresh docs and examples**.
7. **Run quality checks**:
   - `npm run check`
8. **Smoke-test install matrix** (below).

---

## 10) Smoke Test Matrix (must pass)

Run each from repo root:

1. Local, single runtime
   - `node bin/install.js --codecompanion --scope local --dry-run`
2. Local, multi-runtime
   - `node bin/install.js --codecompanion --claude --gemini --scope local --dry-run`
3. Global, multi-runtime
   - `node bin/install.js --codecompanion --claude --gemini --scope global --install-dir ~/.ai --dry-run`
4. Real write local
   - `node bin/install.js --codecompanion --claude --scope local`
5. Verify outputs
   - command files exist in runtime command dirs
   - `.sheaf-runtime/{templates,workflows,references,skills,rules,tools}` exists once
   - no `<runtime>/sheaf/` newly created

---

## 11) Acceptance Criteria

1. Installing any runtime creates/uses exactly one shared `.sheaf-runtime/` per install root.
2. Runtime command entrypoints remain in their current runtime-specific locations.
3. All prompt/reference links resolve through `{{SHEAF_RUNTIME_DIR}}` replacement.
4. No `{{RUNTIME_DIR}}` remains in source.
5. `fix-skill-paths` emits shared-folder-compatible paths.
6. Installer warns (non-destructive) if legacy per-runtime `sheaf/` directories are present.
7. Local/global scope behavior remains unchanged semantically (relative vs absolute).

---

## 12) Non-Goals

- Backward compatibility with old token.
- Automatic migration/deletion of legacy runtime `sheaf/` folders.
- Per-runtime mixed install roots in one install run.

---

## 13) Risks and Mitigations

1. **Single shared folder is a single point of failure**
   - Mitigation: clear docs, deterministic install command, easy reinstall.
2. **Legacy folder confusion**
   - Mitigation: explicit installer warnings.
3. **Missed token replacements**
   - Mitigation: grep validation gate in implementation checklist.

---

## 14) Rollout Note

Because project is pre-adoption, this breaking change is acceptable without compatibility layer. This spec is self-contained and sufficient to implement without consulting additional repository files.
