---
name: sheaf:unify
description: Reconcile APPLY results and close the loop
---

<objective>
Reconcile an executed PLAN.md against actual results, create SUMMARY.md, update state, and close the PLAN → APPLY → UNIFY loop.
</objective>

<execution_context>
`{{RUNTIME_DIR}}/sheaf/workflows/unify-phase.md`
</execution_context>

<context>
`$PLAN_PATH`: $ARGUMENTS
</context>

<process>
Follow the instructions in {{RUNTIME_DIR}}/sheaf/workflows/unify-phase.md
</process>

<success_criteria>
- [ ] SUMMARY.md created from actual execution
- [ ] STATE.md updated with closed loop position
- [ ] Deviations and deferred items documented
- [ ] ROADMAP.md updated when needed
- [ ] User has exactly ONE clear next action
</success_criteria>
