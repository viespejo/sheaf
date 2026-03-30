---
name: sheaf:resume
description: Restore SHEAF context from STATE.md and handoff, then continue with one next action
interaction: chat
opts:
  alias: sheaf_resume
  auto_submit: false
  is_slash_cmd: true
---

## user

@{agentic}

<objective>
Restore SHEAF context after a session break, detect active handoff context, identify current loop position, and suggest exactly ONE next action.

Use this when starting a new session in an existing `.sheaf` project.
</objective>

<execution_context>
`{{AGENT_DIR}}/sheaf/workflows/resume-project.md`
`{{AGENT_DIR}}/sheaf/references/loop-phases.md`
`{{AGENT_DIR}}/sheaf/references/context-management.md`
</execution_context>

<context>
Optional handoff path: $ARGUMENTS

.sheaf/STATE.md
.sheaf/PROJECT.md (if present)
</context>

<process>
**Follow workflow: {{AGENT_DIR}}/sheaf/workflows/resume-project.md**

Core flow:
1. Verify `.sheaf/` exists
2. Detect handoff files (or use `$ARGUMENTS` if provided)
3. Read `.sheaf/STATE.md`
4. Load handoff/resume context (if available)
5. Reconcile state and handoff information
6. Determine exactly ONE next action from loop position
7. Show concise resume report with single routing
8. After user proceeds, archive consumed handoff

Behavior rules:
- Do not show multiple action options
- Prefer `.sheaf/STATE.md` as source of truth when handoff is stale
- Keep momentum: one deterministic continuation action
</process>

<success_criteria>
- [ ] Context restored from `.sheaf/STATE.md` and/or handoff
- [ ] Loop position correctly identified
- [ ] Exactly ONE next action suggested
- [ ] Handoff lifecycle handled (archive/delete) after user proceeds
</success_criteria>
