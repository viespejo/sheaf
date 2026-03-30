---
name: sheaf:init
description: Initialize SHEAF from project docs (personal workflow)
---

<objective>
Initialize the `.sheaf/` structure using existing project documents as primary context.
Required docs: `docs/prd.md` and `docs/architecture.md`.
`PLANNING.md` is auto-included when present.
Optional docs may be added by the user for extra context.
</objective>

<execution_context>
`{{AGENT_DIR}}/sheaf/workflows/init-project.md`
`{{AGENT_DIR}}/sheaf/templates/PROJECT.md`
`{{AGENT_DIR}}/sheaf/templates/STATE.md`
`{{AGENT_DIR}}/sheaf/templates/ROADMAP.md`
</execution_context>

<context>
Current directory state and required docs availability.
</context>

<process>
**Follow workflow: {{AGENT_DIR}}/sheaf/workflows/init-project.md**

The workflow is personal and doc-first:

1. Check for existing `.sheaf/` (route to resume/progress if exists)
2. Validate `docs/prd.md` and `docs/architecture.md`
3. Auto-include `PLANNING.md` when present
4. Ask for optional extra context files
5. Read docs and extract project context
6. Run Interview Mode when critical information is missing/unclear (one question at a time, with recommendation)
7. Create `.sheaf/PROJECT.md`, `.sheaf/ROADMAP.md`, `.sheaf/STATE.md`, `.sheaf/sheaf.json`
8. Display one next action: `/sheaf:plan`

**Behavior rules:**

- Do not run generalized multi-project branching
- Use documents as source of truth
- Use Interview Mode for critical ambiguity and resolve decision dependencies
- Enforce one-question-at-a-time with a clear decision before advancing
- Include recommended answer for every interview question
- Explore docs/codebase before asking when possible
- End with exactly ONE next action
</process>

<success_criteria>
- [ ] `.sheaf/` directory created
- [ ] Required docs validated (`docs/prd.md`, `docs/architecture.md`)
- [ ] `PLANNING.md` auto-included when present
- [ ] Optional docs accepted when provided
- [ ] PROJECT.md populated from doc-derived context
- [ ] STATE.md initialized with correct loop position
- [ ] ROADMAP.md initialized for planning
- [ ] User presented with ONE clear next action
</success_criteria>
