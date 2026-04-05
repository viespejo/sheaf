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

| Runtime       | Output dir       | Command dir      | Prompt output |
| ------------- | ---------------- | ---------------- | ------------- |
| CodeCompanion | `.codecompanion` | `prompts/sheaf`  | `.md`         |
| Claude Code   | `.claude`        | `commands/sheaf` | `.md`         |
| Gemini CLI    | `.gemini`        | `commands/sheaf` | `.toml`       |

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
- `sheaf:create-prd` (skill workflow execution)
- `sheaf:edit-prd` (skill workflow execution)
- `sheaf:validate-prd` (skill workflow execution)
- `sheaf:rfc` (direct RFC planning prompt pattern)

### Command map

| Command               | Primary execution context               | Layer     |
| --------------------- | --------------------------------------- | --------- |
| `sheaf:init`          | `workflows/init-project.md`             | Core      |
| `sheaf:plan`          | `workflows/plan-phase.md`               | Core      |
| `sheaf:apply`         | `workflows/apply-phase.md`              | Core      |
| `sheaf:unify`         | `workflows/unify-phase.md`              | Core      |
| `sheaf:resume`        | `workflows/resume-project.md`           | Core      |
| `sheaf:progress`      | `workflows/progress-project.md`         | Core      |
| `sheaf:handoff`       | `workflows/handoff-project.md`          | Core      |
| `sheaf:brainstorming` | `skills/bmad-brainstorming/workflow.md` | Extension |
| `sheaf:product-brief` | `skills/bmad-product-brief/SKILL.md`    | Extension |
| `sheaf:create-prd`    | `skills/bmad-create-prd/workflow.md`    | Extension |
| `sheaf:edit-prd`      | `skills/bmad-edit-prd/workflow.md`      | Extension |
| `sheaf:validate-prd`  | `skills/bmad-validate-prd/workflow.md`  | Extension |
| `sheaf:rfc`           | Inline RFC process in prompt body       | Extension |

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

| Path                  | Role type                             | Runtime role                                               |
| --------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `src/prompts/base`    | Active launcher contracts             | Defines command intent/delegation                          |
| `src/prompts/targets` | Active runtime wrappers               | Shapes runtime-specific command envelope                   |
| `src/workflows`       | Active behavioral contracts           | Core loop and continuity behavior                          |
| `src/skills`          | Active extension capability contracts | Specialized flows (BMAD brainstorming/product brief, etc.) |
| `src/references`      | Consultative                          | Decision guidance and operational reference                |
| `src/templates`       | Generative                            | Blueprint for runtime-generated artifacts                  |
| `src/rules`           | Governance/informative                | Authoring standards and consistency rules                  |
| `src/tools`           | Operational utility                   | Context priming and helper scripts                         |
| `src/runtimes`        | Active adapter definitions            | Runtime transform and output policy                        |

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

- Drift between workflow contracts and implemented behavior.
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
