# SHEAF

SHEAF is an opinionated, single-architect workflow system for planning and executing software work with strong continuity across sessions.

It is designed for day-to-day implementation work with one core principle:

- always maintain momentum with **exactly one clear next action**.

---

## See also

- [QUICKSTART.md](./QUICKSTART.md) — compact daily operating guide

---

## Installation

SHEAF is installed with a guided project installer:

```bash
npx viespejo/sheaf
```

### Choose installation mode

- **Interactive (Recommended)**: Simply run the command above and follow the prompts.
- **Flags**: Use specific flags to automate the installation.

### Recommended commands

Install for CodeCompanion (Neovim):

```bash
npx viespejo/sheaf --codecompanion
```

Install for Claude Code:

```bash
npx viespejo/sheaf --claude
```

Install for Gemini CLI:

```bash
npx viespejo/sheaf --gemini
```

Preview without writing files:

```bash
npx viespejo/sheaf --codecompanion --dry-run
```

Custom installation (multiple runtimes, global paths, custom directory):

```bash
npx viespejo/sheaf --codecompanion --claude --gemini --scope global --install-dir ~/.ai
```

### Installation Parameters

- **Scope** (`-s, --scope`):
  - `local` (default): References are rewritten relative to the agent's own directory (e.g., `./.codecompanion/`).
  - `global`: References are rewritten as absolute paths to the installation target.
- **Install Directory** (`-t, --install-dir`): The base directory where agent folders will be created.
- **Runtimes**: Use any combination of `--codecompanion`, `--claude`, and `--gemini` to select which artifacts to install.

### What gets installed

Each selected runtime receives its own directory (`.codecompanion/`, `.claude/`, or `.gemini/`) containing:

- `prompts/sheaf/` (CodeCompanion) or `commands/sheaf/` (Claude/Gemini)

- `sheaf/templates/`
- `sheaf/workflows/`
- `sheaf/references/`
- `sheaf/skills/`
- `sheaf/rules/` (if present)

### Path rewriting and Adaptation behavior

During install, markdown references using the `{{SHEAF_RUNTIME_DIR}}` placeholder are rewritten automatically based on the chosen **Scope**.

Runtime prompt behavior:

- CodeCompanion and Claude receive markdown prompt outputs.
- Gemini receives TOML command outputs generated from composed markdown prompts.

### Important notes

- Installation is copy-based; existing files at the target can be overwritten.
- If no runtime flags are provided, the installer runs in interactive mode.

---

## Context Priming for LLM Sessions (Optional)

If you want to avoid repetitive repository discovery (`ls`, `find`, `cat`) at the start of a coding session, you can generate a structured context snapshot manually before chatting with an LLM.

Reference path:

- `{{SHEAF_RUNTIME_DIR}}/tools/context-dump.sh`

Concrete installed path:

- Shared runtime assets: `.sheaf-runtime/tools/context-dump.sh`

Run the command from the **project root you want to snapshot**.

### Usage patterns

Ephemeral output to stdout (default):

```bash
bash .sheaf-runtime/tools/context-dump.sh
```

Save output to file (optional):

```bash
bash .sheaf-runtime/tools/context-dump.sh --out context.md
```

Add ad-hoc files at runtime:

```bash
bash .sheaf-runtime/tools/context-dump.sh --include docs/decisions.md
```

### `.contextdump` and `--include`

- `.contextdump` is optional.
- When present, it is read from the project root (one relative path per line, comments allowed).
- `--include` appends extra files at runtime.
- Entries from `.contextdump` and `--include` are merged with deduplication.

### Optional direct execution

Canonical usage is `bash <path>`, but you can run it directly if executable:

```bash
chmod +x .sheaf-runtime/tools/context-dump.sh
./.sheaf-runtime/tools/context-dump.sh
```

- convert product/architecture intent into executable plans,
- execute plans with explicit control per task,
- reconcile results into durable summaries,
- preserve session continuity so you can resume quickly,
- avoid decision fatigue through deterministic routing.

SHEAF is intentionally not a generic framework with many setup branches. It is optimized for practical, personal software delivery.

---

## Core philosophy

### 1) Document-first, state-first

- Initialization starts from your docs (`docs/prd.md`, `docs/architecture.md`).
- Ongoing work is guided primarily by `.sheaf/STATE.md`, `.sheaf/ROADMAP.md`, and `.sheaf/PROJECT.md`.
- Existing SHEAF artifacts are your operational memory.

### 2) One-next-action invariant

At the end of every command/workflow, SHEAF should route to one deterministic next step.

No action menus. No “pick 1 of 4” fatigue.

### 3) PLAN → APPLY → UNIFY loop discipline

Every unit of work follows the loop:

- PLAN: decide and approve work
- APPLY: execute tasks with explicit choices
- UNIFY: reconcile what actually happened

Skipping phases reduces traceability and quality.

### 4) Continuity by design

SHEAF treats continuity as first-class:

- `STATE.md` for ongoing digest,
- `HANDOFF*.md` for session transfer,
- `resume` and `progress` commands for deterministic routing.

---

## SHEAF structure

After initialization, SHEAF uses this structure:

```text
.sheaf/
  PROJECT.md
  ROADMAP.md
  STATE.md
  sheaf.json
  execution-log.json            # created/updated as needed by APPLY
  HANDOFF-*.md                 # created by handoff command
  handoffs/archive/            # used by resume lifecycle
  phases/
    NN-phase-name/
      NN-PP-PLAN.md
      NN-PP-SUMMARY.md
```

---

## Commands overview

### `/sheaf:init`

Initialize SHEAF from docs and create core `.sheaf` artifacts.

- Primary use: first setup in a repository.
- Required docs: `docs/prd.md`, `docs/architecture.md`.
- Auto-includes `PLANNING.md` if present.
- May run interview mode for critical ambiguity.
- Ends with one action: `/sheaf:plan`.

### `/sheaf:plan`

Create or continue one implementation plan for a selected story.

- Collaborative-first: discuss in chat before writing files.
- Uses INIT artifacts as primary context.
- Writes PLAN only after explicit approval.
- Updates state/roadmap after approval.
- Ends with one action: `/sheaf:apply [plan-path]`.

### `/sheaf:brainstorming`

Run a BMAD-style interactive brainstorming session with continuity.

- Detects previous brainstorming sessions and supports continue/new selection.
- Supports 4 approach modes: user-selected, AI-recommended, random, progressive flow.
- Facilitates collaborative ideation before convergence.
- Organizes ideas into themes and produces prioritized action steps.
- Persists session notes in `.sheaf/brainstorming/` for later continuation.
- Ends with one deterministic next action.

### `/sheaf:apply`

Execute an approved plan with per-task user control.

For each task, SHEAF shows a preview and requires a decision:

1. manual apply (you edit and confirm),
2. SHEAF apply (agent writes changes),
3. skip (logged as deviation).

- Supports stop/pause behavior with continuity.
- Logs outcomes for reconciliation.
- Routes to `/sheaf:unify [plan-path]` when execution is complete.

### `/sheaf:unify`

Reconcile planned vs actual execution and close the loop.

- Creates `SUMMARY.md` next to PLAN.
- Updates `STATE.md` loop position.
- Updates `ROADMAP.md` where applicable.
- Runs transition workflow if phase is fully unified.
- Ends with one action: `/sheaf:plan`.

### `/sheaf:resume`

Restore context at the start of a new session.

- Reads `.sheaf/STATE.md`.
- Detects optional handoff (`.sheaf/HANDOFF*.md` or provided path).
- Reconciles handoff vs state (state-first if stale/conflicting).
- Suggests exactly one next action.
- Archives consumed handoff after user proceeds.

### `/sheaf:progress`

Mid-session checkpoint with deterministic routing.

- Reads `STATE.md` + `ROADMAP.md`.
- Shows milestone/phase/loop status.
- Supports optional user context (time limit, blocker, priority).
- Suggests exactly one next action.
- Adds context advisory when deep/critical risk is detected.

### `/sheaf:handoff`

Generate a comprehensive continuity document for the next session.

- Synthesizes state + session evidence + optional notes.
- Creates `.sheaf/HANDOFF-{timestamp}-{context}.md`.
- Includes accomplishments, decisions, gaps, open questions, references, and prioritized next actions.
- Updates `STATE.md` Session Continuity with handoff pointer.

### `/sheaf:product-brief`

Create or update product briefs through guided or autonomous discovery using the **BMAD Product Brief** skill.

- **Objective**: Guides you from raw ideas to polished executive summaries (1-2 pages) and optionally an LLM distillate for PRD creation.
- **Modes**:
  - **Guided** (Default): Conversational discovery with soft gates.
  - **Yolo**: Fast-track drafting followed by refinement.
  - **Autonomous**: Headless execution for structured inputs or flags (`--autonomous`).
- **Features**:
  - **Contextual Discovery**: Analyzes local artifacts and performs web research via specialized subagents.
  - **Multi-lens Review**: Uses Skeptic and Opportunity reviewers to stress-test the draft.
  - **Distillate Generation**: Captures technical details, rejected ideas, and requirements for downstream use.

### `/sheaf:create-prd`

Create a new Product Requirements Document (PRD) from scratch using the **BMAD Create PRD** skill.

- **Objective**: Transform a product brief or raw requirements into a structured, comprehensive PRD.
- **Process**: Follows a specialized workflow to ensure all critical sections (context, goals, user stories, technical requirements, etc.) are addressed.

### `/sheaf:edit-prd`

Edit and refine an existing PRD using the **BMAD Edit PRD** skill.

- **Objective**: Update, expand, or pivot an existing requirements document based on new feedback or changing scope.
- **Process**: Maintains document consistency while incorporating specific changes.

### `/sheaf:validate-prd`

Validate a PRD against organizational or quality standards using the **BMAD Validate PRD** skill.

- **Objective**: Ensure a PRD is complete, consistent, and ready for implementation.
- **Process**: Analyzes the document for gaps, ambiguities, and alignment with project goals.

---

## Maintenance Tools

### `bin/fix-skill-paths.js`

Standardizes relative paths in skill prompts to absolute SHEAF-style paths. Use this when developing or updating skills to ensure all internal references (prompts, agents, resources, etc.) are correctly resolved during installation.

- **Usage**: `node bin/fix-skill-paths.js <skill-name>`
- **Features**:
  - Resolves folder references (`prompts/`, `agents/`, etc.) relative to the current file.
  - Resolves direct `.md` file references within the same directory.
  - Automatically handles `../` and `./` prefixes.
  - Verifies file existence for local references to avoid false positives.

---

## Workflow files (engine behavior)

SHEAF command behavior is defined in these workflow documents:

- `src/workflows/init-project.md`
- `src/workflows/plan-phase.md`
- `src/workflows/apply-phase.md`
- `src/workflows/unify-phase.md`
- `src/workflows/transition-phase.md`
- `src/workflows/resume-project.md`
- `src/workflows/progress-project.md`
- `src/workflows/handoff-project.md`

Think of commands as entrypoints and workflows as operational contracts.

---

## Reference files

Shared rules and guidance:

- `src/references/loop-phases.md`
  - loop semantics,
  - phase invariants,
  - transition conditions,
  - anti-patterns.

- `src/references/plan-format.md`
  - expected plan shape and conventions.

- `src/references/context-management.md`
  - context brackets (FRESH/MODERATE/DEEP/CRITICAL),
  - lean context loading,
  - handoff and continuity guidance.

---

## Template files

SHEAF uses templates for consistent artifacts:

- `src/templates/PROJECT.md`
- `src/templates/ROADMAP.md`
- `src/templates/STATE.md`
- `src/templates/PLAN.md`
- `src/templates/SUMMARY.md`

---

## Standard daily flow

A typical work cycle:

1. Start session: `/sheaf:resume`
2. Check orientation (optional): `/sheaf:progress`
3. Plan next unit: `/sheaf:plan`
4. Execute: `/sheaf:apply [plan-path]`
5. Reconcile/close: `/sheaf:unify [plan-path]`
6. End session safely: `/sheaf:handoff`

For quick mid-session checks, use `/sheaf:progress` at any point.

---

## When to use resume vs progress vs handoff

- Use **resume** when starting a **new session** and you need context restoration.
- Use **progress** during an **active session** for a status checkpoint + next action.
- Use **handoff** before stopping work when continuity risk exists.

Quick rule:

- new session → `resume`
- same session, unsure next step → `progress`
- ending session / context risk → `handoff`

---

## Loop routing logic (simplified)

Given loop markers in state:

- PLAN ○ → `/sheaf:plan`
- PLAN ✓, APPLY ○ → `/sheaf:apply [plan-path]`
- PLAN ✓, APPLY ✓, UNIFY ○ → `/sheaf:unify [plan-path]`
- PLAN ✓, APPLY ✓, UNIFY ✓ → `/sheaf:plan` (next work unit)
- blocked → address blocker first

Always one action.

---

## APPLY task decision contract

During APPLY, each task must end in an explicit outcome:

- `manual`
- `agent_applied`
- `skipped`
- `stopped`

This contract is mandatory so UNIFY can reconcile accurately.

---

## State hygiene guidelines

Keep `.sheaf/STATE.md` as a digest, not an archive.

Recommended practices:

- update after major state transitions,
- keep only active blockers/deferred issues,
- keep continuity section explicit and current,
- avoid bloating state with full historical detail,
- rely on `SUMMARY.md` + handoffs for deeper history.

---

## Context management model

SHEAF tracks context pressure with practical brackets:

- FRESH (>70%): normal pace
- MODERATE (40–70%): reinforce core context
- DEEP (20–40%): reduce reads, prepare continuity
- CRITICAL (<20%): finish safely, write handoff

At DEEP/CRITICAL, avoid starting broad new work without continuity preparation.

---

## Output quality expectations

### Planning quality

- one story per plan,
- clear acceptance criteria,
- explicit boundaries,
- tasks with files/action/verify/done,
- explicit approval before execution.

### Execution quality

- preview before writes,
- explicit per-task user decision,
- boundary respect,
- deviations logged.

### Reconciliation quality

- SUMMARY reflects actual outcomes,
- criteria pass/fail/partial with evidence,
- deferred items explicit,
- state and roadmap synchronized.

---

## Known invariants and anti-patterns

### Invariants

- never execute without approved plan,
- never skip UNIFY after APPLY,
- never end workflow with ambiguous/multiple next actions,
- never invent execution results when evidence is missing.

### Anti-patterns

- loading everything “just in case”,
- reflexive dependency chains in plans,
- silent scope drift beyond boundaries,
- postponing summary/state updates until “later”.

---

## Practical command examples

```text
/sheaf:init
/sheaf:plan
/sheaf:apply .sheaf/phases/04-workflows-layer/04-01-PLAN.md
/sheaf:unify .sheaf/phases/04-workflows-layer/04-01-PLAN.md
/sheaf:resume
/sheaf:resume .sheaf/HANDOFF-20260329-1845-phase04-apply.md
/sheaf:progress
/sheaf:progress only 30 minutes today
/sheaf:handoff
/sheaf:handoff pending db migration decision + test gap on auth module
```

---

## Suggested operating routine

Start of day:

1. run `/sheaf:resume`,
2. accept or correct the suggested next action,
3. if needed run `/sheaf:progress` for extra orientation.

During work:

1. keep loop discipline,
2. use progress for checkpoints,
3. avoid starting new large scope at deep/critical context.

End of day:

1. run `/sheaf:handoff`,
2. verify top next action is explicit,
3. next session begins with `/sheaf:resume`.

---

## Current command set in this repo

Available prompt entrypoints under `src/prompts/`:

- `init.md`
- `plan.md`
- `apply.md`
- `unify.md`
- `resume.md`
- `progress.md`
- `handoff.md`
- `product-brief.md`
- `create-prd.md`
- `edit-prd.md`
- `validate-prd.md`
- `brainstorming.md`

If your runtime requires explicit command registration outside prompt files, wire these entrypoints in your host configuration.

---

## Final principle

SHEAF is most effective when you optimize for continuity, traceability, and momentum:

- plan clearly,
- execute intentionally,
- reconcile honestly,
- preserve context before it is lost,
- keep moving with one clear next step.
