---
name: sheaf:handoff
description: Generate a comprehensive session handoff document for the next resume
---

<objective>
Generate a comprehensive handoff document that captures session outcomes, decisions, open gaps, and prioritized next actions.

Use this at end of session, before context break, or when continuity quality matters.
</objective>

<execution_context>
`{{SHEAF_RUNTIME_DIR}}/workflows/handoff-project.md`
</execution_context>

<context>
`ARGUMENTS`: $ARGUMENTS
</context>

<process>
Follow the instructions in {{SHEAF_RUNTIME_DIR}}/workflows/handoff-project.md
</process>

<success_criteria>
- [ ] Current state loaded from `.sheaf/STATE.md`
- [ ] Session signals extracted from conversation
- [ ] Optional inline notes incorporated
- [ ] Structured handoff file created in `.sheaf/`
- [ ] Prioritized next actions included
- [ ] Resume instruction included (`/sheaf:resume`)
</success_criteria>
