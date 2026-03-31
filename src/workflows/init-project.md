<purpose>
Initialize SHEAF structure in a personal project using existing documentation as primary context.
This INIT is opinionated for a single-user architect workflow and avoids framework-style branching.
</purpose>

<when_to_use>
- Starting SHEAF in a project that doesn't have .sheaf/ directory
- User explicitly requests project initialization
- User already has docs/prd.md and docs/architecture.md (plus optional extra context docs)
</when_to_use>

<philosophy>
**Personal and document-first:**
- Use existing project docs as source of truth
- Ask only for missing critical information or clarifications, don't assume - verify with user if unclear
- Remove generic framework branches that add friction
- End with one concrete next action
</philosophy>

<references>
`{{RUNTIME_DIR}}/sheaf/references/sheaf-json.md`
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

<step name="detect_planning_md" priority="early">
**Check for existing PLANNING.md.**

1. Check if PLANNING.md exists in project root:
   ```bash
   ls PLANNING.md 2>/dev/null
   ```
2. **If found:**
   - Display:
     ```
     Found PLANNING.md in this directory.

     This file contains project requirements that can populate your SHEAF setup
     automatically — instead of answering setup questions from scratch.

     [1] Yes, import from PLANNING.md
     [2] No, start fresh
     ```
   - Wait for response
   - **If "1" or "yes" or "import":**
     - Read PLANNING.md fully
     - Parse: project name, description, core value, type, tech stack, requirements, constraints, phases, success criteria
     - Store all parsed fields
     - Skip to `create_structure` → then directly to `create_project_md` (using imported data)
     - Skip the requirements walkthrough (PLANNING.md already covers it)
   - **If "2" or "no" or "fresh":**
     - Proceed with normal flow

3. **If not found:** Proceed with normal flow - next step -> validate_project_docs (no message needed)
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

<step name="validate_project_docs">
Validate docs files in project root:
- `docs/prd.md`
- `docs/architecture.md`

Checks:
```bash
ls docs/prd.md 2>/dev/null
ls docs/architecture.md 2>/dev/null
```

If any required file is missing:
- Report exactly which file(s) are missing.
- Inform user: "Documentation not found. Switching to Conversational Discovery Mode."
- Store `docs_found = false`.
- Skip to `conversational_discovery` step → then directly to `create_project_md` (using conversational discovery data).

If both exist:
- Store `docs_found = true`.
- Skip to `collect_optional_context` step.
</step>

<step name="conversational_discovery">
**Ask ONE question at a time — instead of batching questions, because single-question flow produces more thoughtful answers and builds conversational momentum.**

---

**Question 1: Core Value**
```
What's the core value this project delivers?

(Example: "Users can track expenses and see spending patterns")
```

Wait for user response. Store as `core_value`.

---

**Question 2: What are you building?**
```
What are you building? (1-2 sentences)

(Example: "A CLI tool for managing Docker containers"
 or "An email drip campaign for our SaaS launch"
 or "An automation that syncs CRM contacts to our email platform")
```

Wait for user response. Store as `description`.

---

**Question 3: Project name**

Infer from:
1. Directory name
2. package.json name field
3. Ask if unclear

If obvious, confirm:
```
Project name: [inferred-name]

Is this correct? (yes/different name)
```

Store as `project_name`.

---

**Question 4: Project type**

**Determine what kind of project this is — instead of assuming everything is a software application, because SHEAF manages campaigns, workflows, and other non-code projects equally well.**

Present type selection:
```
What kind of project is this?

[1] Application — software (web app, CLI, API, mobile app)
[2] Workflow — automation (integrations, processes, pipelines)
[3] Other — tell me what you're building
```

Wait for user response.

**If "3" or "other":**
- Ask: "Describe it briefly — I'll adapt the setup questions."
- Store response, proceed with universal sections only

Store as `project_type`.

**Infer complexity from description + type:**
- **Simple:** description mentions single purpose, 1-2 features, small scope → store `complexity = simple`
- **Standard:** typical scope for the type → store `complexity = standard`
- **Complex:** multi-service, multi-channel, enterprise, or user mentions multiple major systems → store `complexity = complex`

Do NOT ask the user about complexity — infer it. If uncertain, default to `standard`.

---

**Requirements walkthrough**

**Type-adapted requirements gathering. Work through sections conversationally — offer concrete suggestions when the user is stuck, push toward decisions when it's time, let ideas breathe when they need space.**

**Style rules:**
- Present 1-2 related sections at a time, not all at once — instead of dumping every question, because focused conversations produce deeper answers
- If the user already addressed something naturally in prior answers, acknowledge it and move on — instead of re-asking, because repetition kills momentum
- Offer concrete suggestions: "For this kind of project, most builders use X because..." or "Given your timeline, you might consider Y"
- If the user is stuck, propose a direction: "Here's one way this could work: ..."
- If the user is going too broad, gently constrain: "That's ambitious — what's the minimum slice that proves the concept?"

**Section routing by type:**

**Application projects — ask in this order:**
1. **Tech Stack:** "Do you have a stack in mind, or exploring? What's the deployment target?" (Suggest: "For solo builders, Next.js + SQLite ships fast. For teams, consider what everyone knows.")
2. **Core Features:** "What are the 3-5 things a user does in this app? What's the minimum slice that proves the concept?"
3. **Data Model (skip if complexity=simple):** "What are the core things this app tracks? How do they relate? Start with 3-5 entities."
4. **Deployment Target (skip if complexity=simple):** "Where does this run? Local dev, cloud, Docker? CI/CD needed?"
5. **Known Constraints:** "Any auth requirements? External APIs you need to integrate? Compliance needs? Hard timeline?"
6. **Success Criteria:** "What does 'working' look like? How will you know this project succeeded?"

**Workflow projects — ask in this order:**
1. **Automation Scope:** "What does this automate? What triggers it?"
2. **Integrations & Tools:** "What systems does this connect? APIs, webhooks, platforms involved?"
3. **Data Flow:** "What data goes in, what comes out? Where does it execute — cron, webhook, manual trigger?"
4. **Known Constraints:** "Rate limits? Auth requirements? Error handling needs? SLAs?"
5. **Success Criteria:** "What does 'done' look like? How do you verify it works?"

**Other projects — universal sections only:**
1. **Core Deliverables:** "What are the main things this project produces or delivers?"
2. **Tools Involved:** "What tools, platforms, or technologies are involved?"
3. **Known Constraints:** "Any hard limits, requirements, or timeline constraints?"
4. **Success Criteria:** "How will you know this project succeeded?"

**Adaptive depth:**
- If `complexity = simple`: Ask core features/deliverables + constraints + success criteria only. Skip data model, deployment detail, and any section not essential.
- If `complexity = standard`: Full walkthrough for the selected type.
- If `complexity = complex`: Full walkthrough. After completing, trigger the SEED recommendation below.

Store all gathered data by section name.

Wait for user response at each section boundary before proceeding.

---

- Proceed to create_project_md with gathered data

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

<step name="read_and_extract_context">
Condition: Run only if `docs_found == true`.

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
- If a question can be answered from project docs o conversational discovery, extract it and mark Decision as `resolved from context`
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
**Generate PROJECT.md populated from walkthrough data — instead of skeleton placeholders, because plans built against real requirements produce better output.**

Create `.sheaf/PROJECT.md`:

```markdown
# [project_name]

## What This Is

[description]

## Core Value

[core_value]

## Current State

| Attribute | Value |
|-----------|-------|
| Type | [project_type] |
| Version | 0.0.0 |
| Status | Initializing |
| Last Updated | [timestamp] |

## Requirements

### Core [Features / Deliverables / Automation Scope — label adapts by type]

[Populated from walkthrough — the 3-5 core items identified]
- [item 1]
- [item 2]
- [item 3]

### Validated (Shipped)
None yet.

### Active (In Progress)
None yet.

### Planned (Next)
[If phases were discussed during walkthrough, list high-level phase goals here]

### Out of Scope
[If user mentioned things they explicitly excluded during walkthrough, capture here]

## Constraints

### Technical Constraints
[Populated from known constraints — tech/platform/deployment limits]
- [constraint 1]

### Business Constraints
[Populated from known constraints — timeline, budget, dependencies]
- [constraint 1]

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
[If tech stack or approach decisions were made during walkthrough, record them]

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
[Populated from success criteria walkthrough — label adapts by type]
| [metric 1] | [target] | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
[Populated from tech stack / platforms / tools walkthrough — adapts by type]
[Application: Framework, DB, Hosting, Auth, etc.]
[Workflow: Integration platform, APIs, Scheduler, etc.]

---
*Created: [timestamp]*
```

**If PLANNING.md was imported:** Populate all sections from parsed PLANNING.md data instead of walkthrough data. Preserve all decisions, tech stack choices, phase breakdowns, and constraints from the original document.

**Fallback:** If any section has no data from the walkthrough (user skipped or answered minimally), use a single-line placeholder: `- To be defined during /sheaf:plan` — instead of multi-line placeholder blocks, because minimal placeholders signal "not yet explored" without cluttering the document.
</step>

<step name="create_roadmap_md">
Create `.sheaf/ROADMAP.md`:

```markdown
# Roadmap: [project_name]

## Overview
[description]

## Current Milestone
**v0.1 Initial Release** (v0.1.0)
Status: Not started
Phases: 0 of TBD complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | TBD | TBD | Not started | - |

## Phase Details

Phases will be defined during `/sheaf:plan`.

---
*Roadmap created: [timestamp]*
```

Note: Phase details are populated during planning, not init.
</step>

<step name="create_state_md">
Create `.sheaf/STATE.md`:

```markdown
# Project State

## Project Reference

See: .sheaf/PROJECT.md (updated [timestamp])

**Core value:** [core_value]
**Current focus:** Project initialized — ready for planning

## Current Position

Milestone: v0.1 Initial Release
Phase: Not yet defined
Plan: None yet
Status: Ready to create roadmap and first PLAN
Last activity: [timestamp] — Project initialized

Progress:
- Milestone: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
```

## Accumulated Context

### Decisions
[If any decisions were made during init walkthrough, record them here]

### Deferred Issues
None yet.

### Blockers/Concerns
None yet.

## Session Continuity

Last session: [timestamp]
Stopped at: Project initialization complete
Next action: Run /sheaf:plan to define phases and first plan
Resume file: .sheaf/PROJECT.md

---
*STATE.md — Updated after every significant action*
```
</step>

<step name="create_sheaf_json">
**Create satellite manifest for external system discovery.**

Reference: {{RUNTIME_DIR}}/sheaf/references/sheaf-json.md

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

**Note:** sheaf.json is infrastructure — no extra display or user prompts needed.
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
  docs/prd.md               ✓
  docs/architecture.md      ✓
  PLANNING.md               ✓ (auto, if present)
  [extra files...]          ✓ (if any)
  Conversational discovery  ✓ (if docs missing)

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
**Unreadable files / permission denied:**
- Report exact file and error
- Ask user to fix permissions and retry

**Optional files missing:**
- Warn and continue without them

**Sparse context after extraction:**
- Ask up to 3 critical questions
- Use planning placeholders for unresolved sections
</error_handling>
