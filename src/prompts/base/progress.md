---
name: sheaf:progress
description: Smart status with deterministic routing to ONE next action
---

<objective>
Show current SHEAF progress and suggest exactly ONE next action.

Use this for a mid-session checkpoint, after resume, or whenever the next step is unclear.
</objective>

<execution_context>
`{{RUNTIME_DIR}}/sheaf/workflows/progress-project.md`
</execution_context>

<context>
`ARGUMENTS`: $ARGUMENTS
</context>

<process>
Follow the instructions in {{RUNTIME_DIR}}/sheaf/workflows/progress-project.md
</process>

<success_criteria>
- [ ] Current progress shown clearly (milestone/phase/loop)
- [ ] Exactly ONE next action suggested
- [ ] Optional user context considered when provided
- [ ] Context advisory shown when deep/critical risk is detected
</success_criteria>
