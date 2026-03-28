<purpose>
Initialize SHEAF structure in a personal project using existing documentation as primary context.
This INIT is opinionated for a single-user architect workflow and avoids framework-style branching.
</purpose>

<when_to_use>
- Starting SHEAF in a project that doesn't have .sheaf/ directory
- User explicitly requests project initialization
- User already has docs/prd.md and docs/architecture.md (plus optional extra context docs)
</when_to_use>

<loop_context>
N/A - This is setup only.
After init, project is ready for first PLAN.
</loop_context>

<philosophy>
**Personal and document-first:**
- Use existing project docs as source of truth
- Ask only for missing critical information or clarifications, don't assume - verify with user if unclear
- Remove generic framework branches that add friction
- End with one concrete next action
</philosophy>

<references>
@src/templates/sheaf-json.md
</references>

<process>

<step name="check_existing" priority="first">
1. Check if .sheaf/ directory exists:
   ```bash
   ls .sheaf/ 2>/dev/null
   ```
2. If exists:
   - "SHEAF already initialized in this project."
   - Route to `/sheaf:resume` or `/sheaf:progress`
   - Exit this workflow
3. If not exists: proceed
</step>

<step name="validate_required_docs" priority="early">
Validate required context files in project root:
- `docs/prd.md`
- `docs/architecture.md`

Checks:
```bash
ls docs/prd.md 2>/dev/null
ls docs/architecture.md 2>/dev/null
```

If any required file is missing:
- Report exactly which file(s) are missing
- Ask user to create/provide them before continuing
- Exit workflow

If both exist:
- Continue
</step>

<step name="auto_include_planning" priority="early">
Check if `PLANNING.md` exists in project root:
```bash
ls PLANNING.md 2>/dev/null
```

If present:
- Add `PLANNING.md` to context automatically
- Store `planning_md_auto_included = true`
- Inform user briefly: "Detected PLANNING.md — it will be included as context."

If not present:
- Store `planning_md_auto_included = false`
- Continue without message
</step>

<step name="collect_optional_context">
Ask user for additional context files (optional):

```
Any additional context files to include?
PLANNING.md will be auto-included if present.
Examples: implementation-ledger.md, docs/decisions.md, docs/notes/*.md

Reply with paths separated by commas, or "none".
```

- Parse user-provided paths
- Keep only files that exist
- If a provided path does not exist, warn and continue with existing files
- Store as `extra_context_files`
</step>

<step name="create_structure">
Create directories first:
```bash
mkdir -p .sheaf/phases
```

Display:
```
SHEAF structure created.
Using docs/prd.md and docs/architecture.md as INIT context.
```
</step>

<step name="read_and_extract_context">
Read required docs and optional extra docs.

Required:
- docs/prd.md
- docs/architecture.md

Optional:
- `PLANNING.md` (if auto-detected)
- all files in `extra_context_files`

Extract:
- `project_name`
- `description` (what this is)
- `core_value`
- architecture constraints and design intent
- current implementation status (if present)
- open risks/questions
- any explicit out-of-scope boundaries

If `project_name` is unclear:
- infer from directory or package.json
- ask for confirmation
</step>

<step name="ask_missing_critical_info">
When critical information is missing or unclear after extraction, run **Interview Mode**.

Interview Mode rules:
- Interview rigorously until shared understanding is reached on critical decisions
- Walk the design tree branch-by-branch
- Resolve decision dependencies one-by-one
- Ask one question at a time
- Do not ask Question N+1 until Decision for N is clear

Per-question output format (required):
```text
[Interview Question N]
Branch: <design branch>
Dependency: <what this depends on>
Why it matters: <impact on plan/architecture>

Question:
<single focused question>

Recommended answer:
<assistant recommendation + brief rationale>

Alternatives (if relevant):
- A: ...
- B: ...

Decision:
<user answer OR resolved from context OR pending>

Impact on next decisions:
- ...
```

Source-of-truth behavior before asking:
- If a question can be answered from project docs, extract it and mark Decision as `resolved from context`
- If a question can be answered by exploring the codebase, explore first and mark Decision as `resolved from context`
- Ask only when uncertainty remains

Escalation and boundedness:
- If unresolved after two attempts, record:
  - `assumption (temporary)`
  - `validation needed in /sheaf:plan`
- Continue with the next dependency branch

Stop condition:
- End Interview Mode once context is clear enough to produce a reliable first `/sheaf:plan`

Priority critical fields:
1. Core value
2. Short description / scope boundary
3. Success criteria or immediate planning target
4. Architecture constraints that materially affect phase planning

Required closeout before file creation:
```text
Interview Summary
- Confirmed decisions
- Temporary assumptions
- Open risks
- Deferred questions for /sheaf:plan
```
</step>

<step name="create_project_md">
Create `.sheaf/PROJECT.md` populated from extracted context.

Minimum required sections to populate:
- What This Is
- Core Value
- Current State
- Requirements (initial core items if available)
- Constraints (technical/business as available)
- Key Decisions (if present in docs)
- Success Metrics (if present; otherwise planning placeholder)
- Tech Stack / Tools (if present)

Fallback for missing sections:
`- To be defined during /sheaf:plan`
</step>

<step name="create_roadmap_md">
Create `.sheaf/ROADMAP.md` with:
- Overview from description
- Current milestone: v0.1 Initial Release
- Phase table initialized for planning
- Note that phases are defined in `/sheaf:plan`
</step>

<step name="create_state_md">
Create `.sheaf/STATE.md` with:
- Core value
- Current focus: initialized from docs
- Loop position ready for first PLAN
- Any extracted blockers/concerns if present
- Next action reference to `/sheaf:plan`
</step>

<step name="create_sheaf_json">
Create `.sheaf/sheaf.json`:
```json
{
  "name": "[project_name]",
  "version": "0.0.0",
  "milestone": {
    "name": "None",
    "version": "0.0.0",
    "status": "not_started"
  },
  "phase": {
    "number": 0,
    "name": "None",
    "status": "not_started"
  },
  "loop": {
    "plan": null,
    "position": "IDLE"
  },
  "timestamps": {
    "created_at": "[ISO timestamp]",
    "updated_at": "[ISO timestamp]"
  },
  "satellite": {
    "groom": true
  }
}
```
</step>

<step name="confirm_and_route">
Display confirmation with one next step:

```
════════════════════════════════════════
SHEAF INITIALIZED
════════════════════════════════════════

Project: [project_name]
Core value: [core_value]

Context used:
  docs/prd.md            ✓
  docs/architecture.md   ✓
  PLANNING.md            ✓ (auto, if present)
  [extra files...]       ✓ (if any)

Created:
  .sheaf/PROJECT.md      ✓
  .sheaf/ROADMAP.md      ✓
  .sheaf/STATE.md        ✓
  .sheaf/sheaf.json      ✓
  .sheaf/phases/         ✓

────────────────────────────────────────
▶ NEXT: /sheaf:plan
  Define phases and create your first plan.
────────────────────────────────────────
```

Do not propose additional next steps.
</step>

</process>

<output>
- `.sheaf/` directory structure
- `.sheaf/PROJECT.md` (doc-driven initialization)
- `.sheaf/ROADMAP.md`
- `.sheaf/STATE.md`
- `.sheaf/sheaf.json`
- `.sheaf/phases/`
- Clear routing to `/sheaf:plan`
</output>

<error_handling>
**Missing required docs:**
- Stop and report missing file(s)
- Ask user to provide required docs

**Unreadable files / permission denied:**
- Report exact file and error
- Ask user to fix permissions and retry

**Optional files missing:**
- Warn and continue without them

**Sparse context after extraction:**
- Ask up to 3 critical questions
- Use planning placeholders for unresolved sections
</error_handling>

