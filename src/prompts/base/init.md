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
`{{RUNTIME_DIR}}/sheaf/workflows/init-project.md`
</execution_context>

<process>
Follow the instructions in {{RUNTIME_DIR}}/sheaf/workflows/init-project.md
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
