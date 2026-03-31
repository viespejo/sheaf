---
name: sheaf:apply
description: Execute an approved PLAN
---

<objective>
Execute an approved PLAN.md file by presenting per-task previews and requiring a per-task decision from the user.
</objective>

<execution_context>
`{{RUNTIME_DIR}}/sheaf/workflows/apply-phase.md`
</execution_context>

<context>
Plan path: $ARGUMENTS
</context>

<process>
Follow the instructions in {{RUNTIME_DIR}}/sheaf/workflows/apply-phase.md
</process>

<success_criteria>
- [ ] All tasks processed (applied by agent, applied manually, or skipped)
- [ ] Decisions logged for UNIFY
- [ ] User informed of completion
- [ ] Next action clear (run /sheaf:unify)
</success_criteria>
