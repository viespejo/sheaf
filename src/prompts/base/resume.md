---
name: sheaf:resume
description: Restore SHEAF context from STATE.md and handoff, then continue with one next action
---

<objective>
Restore SHEAF context after a session break, detect active handoff context, identify current loop position, and suggest exactly ONE next action.

Use this when starting a new session in an existing `.sheaf` project.
</objective>

<execution_context>
`{{SHEAF_RUNTIME_DIR}}/workflows/resume-project.md`
</execution_context>

<context>
`ARGUMENTS`: $ARGUMENTS
</context>

<process>
Follow the instructions in {{SHEAF_RUNTIME_DIR}}/workflows/resume-project.md
</process>

<success_criteria>
- [ ] Context restored from `.sheaf/STATE.md` and/or handoff
- [ ] Loop position correctly identified
- [ ] Exactly ONE next action suggested
- [ ] Handoff lifecycle handled (archive/delete) after user proceeds
</success_criteria>
