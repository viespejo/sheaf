### Project Structure
````
.
├── bin
│   ├── fix-skill-paths.js
│   └── install.js
├── docs
│   └── architecture.md
├── src
│   ├── prompts
│   │   ├── base
│   │   │   ├── apply.md
│   │   │   ├── brainstorming.md
│   │   │   ├── handoff.md
│   │   │   ├── init.md
│   │   │   ├── plan.md
│   │   │   ├── product-brief.md
│   │   │   ├── progress.md
│   │   │   ├── resume.md
│   │   │   ├── rfc.md
│   │   │   └── unify.md
│   │   └── targets
│   │       ├── claude
│   │       │   ├── apply.md
│   │       │   ├── brainstorming.md
│   │       │   ├── handoff.md
│   │       │   ├── init.md
│   │       │   ├── plan.md
│   │       │   ├── product-brief.md
│   │       │   ├── progress.md
│   │       │   ├── resume.md
│   │       │   ├── rfc.md
│   │       │   └── unify.md
│   │       ├── codecompanion
│   │       │   ├── apply.md
│   │       │   ├── brainstorming.md
│   │       │   ├── handoff.md
│   │       │   ├── init.md
│   │       │   ├── plan.md
│   │       │   ├── product-brief.md
│   │       │   ├── progress.md
│   │       │   ├── resume.md
│   │       │   ├── rfc.md
│   │       │   └── unify.md
│   │       └── gemini
│   │           ├── apply.md
│   │           ├── brainstorming.md
│   │           ├── handoff.md
│   │           ├── init.md
│   │           ├── plan.md
│   │           ├── product-brief.md
│   │           ├── progress.md
│   │           ├── resume.md
│   │           ├── rfc.md
│   │           └── unify.md
│   ├── references
│   │   ├── context-management.md
│   │   ├── loop-phases.md
│   │   ├── plan-format.md
│   │   └── sheaf-json.md
│   ├── rules
│   │   ├── prompts.md
│   │   ├── references.md
│   │   ├── style.md
│   │   ├── templates.md
│   │   └── workflows.md
│   ├── runtimes
│   │   ├── gemini.js
│   │   └── index.js
│   ├── skills
│   │   ├── bmad-brainstorming
│   │   │   ├── steps
│   │   │   │   ├── step-01b-continue.md
│   │   │   │   ├── step-01-session-setup.md
│   │   │   │   ├── step-02a-user-selected.md
│   │   │   │   ├── step-02b-ai-recommended.md
│   │   │   │   ├── step-02c-random-selection.md
│   │   │   │   ├── step-02d-progressive-flow.md
│   │   │   │   ├── step-03-technique-execution.md
│   │   │   │   └── step-04-idea-organization.md
│   │   │   ├── brain-methods.csv
│   │   │   ├── SKILL.md
│   │   │   ├── template.md
│   │   │   └── workflow.md
│   │   └── bmad-product-brief
│   │       ├── agents
│   │       │   ├── artifact-analyzer.md
│   │       │   ├── opportunity-reviewer.md
│   │       │   ├── skeptic-reviewer.md
│   │       │   └── web-researcher.md
│   │       ├── prompts
│   │       │   ├── contextual-discovery.md
│   │       │   ├── draft-and-review.md
│   │       │   ├── finalize.md
│   │       │   └── guided-elicitation.md
│   │       ├── resources
│   │       │   └── brief-template.md
│   │       └── SKILL.md
│   ├── templates
│   │   ├── PLAN.md
│   │   ├── PROJECT.md
│   │   ├── ROADMAP.md
│   │   ├── STATE.md
│   │   └── SUMMARY.md
│   ├── tools
│   │   └── context-dump.sh
│   └── workflows
│       ├── apply-phase.md
│       ├── handoff-project.md
│       ├── init-project.md
│       ├── plan-phase.md
│       ├── progress-project.md
│       ├── resume-project.md
│       ├── transition-phase.md
│       └── unify-phase.md
├── .contextdump
├── context.md
├── eslint.config.mjs
├── .gitignore
├── package.json
├── package-lock.json
├── .prettierignore
├── .prettierrc
├── QUICKSTART.md
└── README.md

23 directories, 100 files
````

### Recently Modified (top 10)
````
package.json
package-lock.json
bin/install.js
bin/fix-skill-paths.js
src/runtimes/index.js
src/runtimes/gemini.js
````

### Stack
#### package.json
````json
{
  "name": "@viespejo/sheaf",
  "version": "0.8.0",
  "description": "Personal AI workflow tooling, opinionated and built for one",
  "bin": {
    "sheaf": "bin/install.js"
  },
  "files": [
    "bin",
    "src/prompts",
    "src/templates",
    "src/references",
    "src/workflows",
    "src/skills",
    "src/rules",
    "src/runtimes",
    "src/tools"
  ],
  "keywords": [
    "ai",
    "planning",
    "structured-development",
    "sheaf"
  ],
  "author": "Vicente Espejo",
  "license": "UNLICENSE",
  "type": "module",
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "check": "npm run lint && prettier --check ."
  },
  "tagline": "Your workflow, locally defined. Globally coherent.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/viespejo/sheaf.git"
  },
  "bugs": {
    "url": "https://github.com/viespejo/sheaf/issues"
  },
  "homepage": "https://github.com/viespejo/sheaf#readme",
  "engines": {
    "node": ">=22.17.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.1.0",
    "eslint-config-prettier": "^10.1.8",
    "globals": "^17.4.0",
    "prettier": "^3.8.1"
  },
  "dependencies": {
    "@clack/prompts": "^1.1.0",
    "gray-matter": "^4.0.3"
  }
}
````

### Config Files
### Entry Points
### Modules (src/ first-level)
- **prompts**: 
- **references**: 
- **rules**: 
- **runtimes**: 
- **skills**: 
- **templates**: 
- **tools**: 
- **workflows**: 

### Extra Files
#### README.md
````markdown
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

If your runtime requires explicit command registration outside prompt files, wire these entrypoints in your host configuration.

---

## Final principle

SHEAF is most effective when you optimize for continuity, traceability, and momentum:

- plan clearly,
- execute intentionally,
- reconcile honestly,
- preserve context before it is lost,
- keep moving with one clear next step.
````

#### docs/architecture.md
````markdown
# SHEAF Architecture

## As-of Snapshot

- **Date:** 2026-04-03
- **Document scope:** Source architecture (`bin/`, `src/`) and installed runtime artifacts (`.codecompanion/`, `.claude/`, `.gemini/` outputs)
- **Validated source-of-truth files:**
  - `bin/install.js`
  - `bin/fix-skill-paths.js`
  - `src/runtimes/index.js`
  - `src/runtimes/gemini.js`
  - `src/prompts/base/*.md`
  - `src/prompts/targets/*/*.md`
  - `src/workflows/*.md`
  - `src/references/sheaf-json.md`
  - `src/rules/*.md`

### Known Drift Notes

- `src/references/sheaf-json.md` documents sync triggers beyond what is fully implemented today; note in that file indicates partial workflow sync coverage.
- Command naming in public docs may vary by version; canonical source remains `src/prompts/base/*` command names.

---

## Purpose and Audience

This document defines the architecture of SHEAF for three audiences:

1. **Maintainers** of installer/runtime/prompt/workflow internals.
2. **Contributors** adding commands, skills, workflows, or runtime adapters.
3. **Advanced operators** who need to understand generated runtime artifacts and command behavior.

This is a **hybrid architecture spec**:
- **Descriptive**: how the system currently works.
- **Normative**: non-negotiable contracts and invariants.

---

## Architectural Principles and Invariants

### Core principles

- **Document-first and state-first operation** (`.sheaf/STATE.md` as continuity anchor).
- **Deterministic routing** to one next action.
- **PLAN → APPLY → UNIFY loop discipline**.
- **Prompt wrappers delegate behavior**; workflows and skills carry operational logic.

### Non-negotiable invariants

- Never execute APPLY without explicit plan approval.
- Never close execution without UNIFY reconciliation.
- Never end command flow with ambiguous multi-path routing when deterministic routing is possible.
- Never fabricate execution evidence when evidence is missing.

---

## System Context

SHEAF is a packaging and orchestration system that:

1. **Builds runtime-specific command artifacts** from shared prompt sources.
2. **Installs operational knowledge assets** (workflows, templates, references, skills, rules, tools).
3. **Executes user commands through prompt launchers** that delegate to workflows or skills.
4. **Persists project state in `.sheaf/` artifacts** for continuity across sessions.

---

## Architecture Lanes (Execution Role Classification)

### 1) Execution path (active runtime path)

- `bin/install.js`
- `src/runtimes/index.js`
- `src/runtimes/gemini.js`
- Installed command outputs in runtime directories (`prompts/sheaf` or `commands/sheaf`)

### 2) Behavioral contracts (operational control plane)

- `src/prompts/base/*.md` (command intent + delegation)
- `src/prompts/targets/*/*.md` (runtime wrappers)
- `src/workflows/*.md` (core command behavior contracts)
- `src/skills/**` (extension capability behavior contracts)

### 3) Governance and support artifacts (consultative/generative)

- `src/references/*.md` (decision guides, loop/context/format references)
- `src/templates/*.md` (artifact generation blueprints)
- `src/rules/*.md` (authoring and consistency rules)
- `src/tools/context-dump.sh` (context snapshot support)

> `rules` are informative/governance artifacts. They are copied during install but are not active executables in the composition/transform pipeline.

---

## Build and Install Architecture

## Entry point

- Installer CLI: `bin/install.js`
- Runtime registry: `src/runtimes/index.js`

### Runtime adapter model

| Runtime | Output dir | Command dir | Prompt output |
|---|---|---|---|
| CodeCompanion | `.codecompanion` | `prompts/sheaf` | `.md` |
| Claude Code | `.claude` | `commands/sheaf` | `.md` |
| Gemini CLI | `.gemini` | `commands/sheaf` | `.toml` |

### Prompt composition contract

For each prompt file name in `src/prompts/base/`:

1. Load base prompt (`base/<name>.md`).
2. Load runtime target wrapper (`targets/<runtime>/<name>.md`).
3. Validate target contains `{{BASE_BODY}}` **exactly once**.
4. Merge frontmatter (target overrides base; nested objects shallow-merged).
5. Replace `{{BASE_BODY}}` in target with base body.
6. Rewrite `{{SHEAF_RUNTIME_DIR}}` tokens according to installation scope.
7. Apply runtime transform:
   - Markdown passthrough for CodeCompanion/Claude.
   - Markdown → TOML conversion for Gemini (`toGeminiToml`).

### Path rewriting contract

`{{SHEAF_RUNTIME_DIR}}` is rewritten using chosen scope:

- **local**: runtime-relative prefix (`./.codecompanion/`, `./.claude/`, `./.gemini/`)
- **global**: absolute install target path

This rewrite is applied to:
- composed command prompts
- copied `.md` artifacts under installed `sheaf/*`

### Install flow (sequence)

```text
User -> CLI (bin/install.js): select runtimes/scope/installDir
CLI -> RUNTIMES registry: load adapter config
loop each selected runtime
  CLI -> base prompts: read *.md
  CLI -> runtime targets: read matching *.md
  CLI -> composer: merge frontmatter + inject {{BASE_BODY}}
  CLI -> path rewriter: replace {{SHEAF_RUNTIME_DIR}}
  CLI -> runtime transform: md passthrough or Gemini TOML
  CLI -> runtime command dir: write prompt/command files
  CLI -> sheaf assets copier: copy templates/workflows/references/skills/rules/tools
end
CLI -> user: install summary
```

---

## Command Orchestration Architecture

## Prompt launcher model

Each core prompt in `src/prompts/base/*.md` defines:

- command name and description
- objective and success criteria
- `execution_context` pointing to workflow or skill artifact
- process directive to follow that artifact

Target wrappers adapt transport shape per runtime (`src/prompts/targets/*/*.md`) while preserving behavioral body from base prompts.

### Core loop commands (platform nucleus)

These commands implement continuity and loop discipline:

- `sheaf:init`
- `sheaf:plan`
- `sheaf:apply`
- `sheaf:unify`
- `sheaf:resume`
- `sheaf:progress`
- `sheaf:handoff`

### Additional capability commands (extension layer)

These commands extend capabilities without redefining loop nucleus:

- `sheaf:brainstorming` (skill workflow execution)
- `sheaf:product-brief` (skill orchestration)
- `sheaf:rfc` (direct RFC planning prompt pattern)

### Command map

| Command | Primary execution context | Layer |
|---|---|---|
| `sheaf:init` | `workflows/init-project.md` | Core |
| `sheaf:plan` | `workflows/plan-phase.md` | Core |
| `sheaf:apply` | `workflows/apply-phase.md` | Core |
| `sheaf:unify` | `workflows/unify-phase.md` | Core |
| `sheaf:resume` | `workflows/resume-project.md` | Core |
| `sheaf:progress` | `workflows/progress-project.md` | Core |
| `sheaf:handoff` | `workflows/handoff-project.md` | Core |
| `sheaf:brainstorming` | `skills/bmad-brainstorming/workflow.md` | Extension |
| `sheaf:product-brief` | `skills/bmad-product-brief/SKILL.md` | Extension |
| `sheaf:rfc` | Inline RFC process in prompt body | Extension |

### Command execution flow (sequence)

```text
User -> Runtime command artifact: invoke /sheaf:<command>
Runtime artifact -> Base composed prompt: command objective/context/process
Base prompt -> Execution context:
  - Workflow file (core commands), or
  - Skill file/workflow (extension commands), or
  - Inline process (rfc)
Execution context -> Project artifacts (.sheaf/*): read/write as required
Execution context -> User: one deterministic next action (core loop expectation)
```

---

## Artifact Taxonomy and Roles

| Path | Role type | Runtime role |
|---|---|---|
| `src/prompts/base` | Active launcher contracts | Defines command intent/delegation |
| `src/prompts/targets` | Active runtime wrappers | Shapes runtime-specific command envelope |
| `src/workflows` | Active behavioral contracts | Core loop and continuity behavior |
| `src/skills` | Active extension capability contracts | Specialized flows (BMAD brainstorming/product brief, etc.) |
| `src/references` | Consultative | Decision guidance and operational reference |
| `src/templates` | Generative | Blueprint for runtime-generated artifacts |
| `src/rules` | Governance/informative | Authoring standards and consistency rules |
| `src/tools` | Operational utility | Context priming and helper scripts |
| `src/runtimes` | Active adapter definitions | Runtime transform and output policy |

### Notes on references vs templates vs skills

- **References** guide decisions and workflow behavior.
- **Templates** are copied blueprints used to create project artifacts during execution.
- **Skills** are reusable capability modules (personal or third-party friendly) that prompts/workflows can invoke by path.

---

## State and Contract Artifacts

Primary project state artifacts live under `.sheaf/` (created during init and evolved by workflows):

- `PROJECT.md`
- `ROADMAP.md`
- `STATE.md`
- `sheaf.json`
- `execution-log.json` (when APPLY logs outcomes)
- phase plans/summaries under `.sheaf/phases/`
- handoff files and archive

### sheaf.json contract

- Intended as machine-readable satellite manifest for external discovery.
- Defined by `src/references/sheaf-json.md`.
- Current behavior should be interpreted with drift note from that reference (partial workflow sync implementation).

---

## Extension Architecture

### Add a new command

1. Add base prompt in `src/prompts/base/<name>.md`.
2. Add matching target wrappers in each runtime under `src/prompts/targets/<runtime>/<name>.md` with exactly one `{{BASE_BODY}}`.
3. If command is core behavior, add/point to workflow in `src/workflows/`.
4. If command is capability extension, add/point to skill artifact under `src/skills/`.

### Add a new skill

1. Create skill directory under `src/skills/<skill-name>/`.
2. Include contract docs (`SKILL.md`, `workflow.md`, prompts/resources/agents/steps as needed).
3. Normalize internal links with `node bin/fix-skill-paths.js <skill-name>`.
4. Reference skill from prompt/workflow using `{{SHEAF_RUNTIME_DIR}}/skills/...` paths.

### Add a new runtime

1. Add runtime entry in `src/runtimes/index.js`.
2. Define output directory, prompt directory, output extension, and transformer.
3. Add runtime target prompt wrappers in `src/prompts/targets/<runtime>/`.
4. Ensure installer composition and write path behavior remain invariant-compliant.

---

## Risks and Guardrails

### Primary architectural risks

- Drift between workflow/reference contracts and implemented behavior.
- Runtime wrapper mismatch (missing target prompt for a base command).
- Composition failures from invalid `{{BASE_BODY}}` usage.
- Confusion between active execution artifacts and governance/reference artifacts.

### Guardrails

- Keep source-of-truth hierarchy explicit: implementation + contracts + drift notes.
- Preserve one-to-one file-name parity between base prompts and runtime targets.
- Keep core loop commands separate from extension commands in documentation and reviews.
- Treat `STATE.md` as continuity digest, not archival dump.

---

## Architectural Summary

SHEAF is a contract-driven command system with a deterministic execution nucleus and an extension layer.

- **Installer + runtime adapters** produce runtime-native command artifacts.
- **Prompts** act as launchers and delegators.
- **Workflows** define core behavior contracts.
- **Skills** provide reusable specialized capabilities.
- **References/templates/rules** support decision quality, artifact generation, and authoring consistency.

The architecture is optimized for continuity, traceability, and one-next-action momentum across sessions.
````


