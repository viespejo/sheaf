---
name: sheaf:apply
description: Execute an approved PLAN
interaction: chat
opts:
  alias: sheaf_apply
  auto_submit: false
  is_slash_cmd: true
---

## user

@{agentic}

<objective>
Execute an approved PLAN.md file by presenting per-task previews and requiring a per-task decision from the user.
</objective>

<execution_context>
`~/.codecompanion/sheaf/workflows/apply-phase.md`
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
4. If SUMMARY exists: "Plan already executed. SUMMARY: {path}"
   - Offer: re-execute or exit
</step>

<step name="execute">
Follow workflow: ~/.codecompanion/sheaf/workflows/apply-phase.md

For each task: SHEAF will show preview fragment(s) and require your choice:

[1] I apply manually — SHEAF waits for "done" (you may also reply "skip" or "stop")
[2] SHEAF applies now — SHEAF writes changes
[3] Skip — record deviation

If you choose "stop", APPLY pauses and can be resumed later.

</step>

<step name="complete">
After tasks complete:
- Report: "APPLY complete. Run /sheaf:unify to close loop."
- Show files modified (only those SHEAF wrote)
- Show SUMMARY path to create
</step>

</process>

<success_criteria>
- [ ] All tasks processed (applied by agent, applied manually, or skipped)
- [ ] Decisions logged for UNIFY
- [ ] User informed of completion
- [ ] Next action clear (run /sheaf:unify)
</success_criteria>
