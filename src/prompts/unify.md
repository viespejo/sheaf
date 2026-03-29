---
name: sheaf:unify
description: Reconcile APPLY results and close the loop
interaction: chat
opts:
  alias: sheaf_unify
  auto_submit: false
  is_slash_cmd: true
---

## user

@{agentic}

<objective>
Reconcile an executed PLAN.md against actual results, create SUMMARY.md, update state, and close the PLAN → APPLY → UNIFY loop.
</objective>

<execution_context>
`~/.codecompanion/sheaf/workflows/unify-phase.md`
`~/.codecompanion/sheaf/workflows/transition-phase.md`
`~/.codecompanion/sheaf/templates/SUMMARY.md`
`~/.codecompanion/sheaf/references/loop-phases.md`
</execution_context>

<context>
Plan path: $ARGUMENTS

.sheaf/STATE.md
</context>

<process>

<step name="validate_plan">
1. Confirm plan file exists at $ARGUMENTS path
2. Error if not found: "Plan not found: {path}"
3. Derive SUMMARY path (replace PLAN.md with SUMMARY.md)
4. If SUMMARY exists: "Loop already closed. SUMMARY: {path}"
   - Offer: regenerate or exit
</step>

<step name="reconcile">
Follow workflow: ~/.codecompanion/sheaf/workflows/unify-phase.md

Reconcile plan vs actual execution:
- Task outcomes (agent_applied / manual / skipped / stopped)
- Acceptance criteria status with evidence
- Deviations and rationale
- Deferred issues and follow-ups
</step>

<step name="close_loop">
After reconciliation:
- Create SUMMARY.md next to PLAN.md
- Update STATE.md loop position to complete
- Update ROADMAP.md when phase progress/status changes
- If last plan in phase: run transition workflow
</step>

<step name="report">
Report completion:
- SUMMARY path
- Loop position closed
- Concise readiness + next action
</step>

</process>

<success_criteria>
- [ ] SUMMARY.md created from actual execution
- [ ] STATE.md updated with closed loop position
- [ ] Deviations and deferred items documented
- [ ] ROADMAP.md updated when needed
- [ ] User has exactly ONE clear next action
</success_criteria>
