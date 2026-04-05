<purpose>
Reconcile what was planned vs. what was actually executed in APPLY. Create SUMMARY.md, update STATE.md, close the loop, and prepare the next planning step.
</purpose>

<when_to_use>
- APPLY is complete (or paused with explicit recorded outcomes)
- PLAN.md exists and was previously approved/executed
- User wants to close the PLAN → APPLY → UNIFY loop
</when_to_use>

<loop_context>
Expected phase: UNIFY
Prior phase: APPLY
Next phase: PLAN
</loop_context>

<required_reading>
.sheaf/STATE.md
.sheaf/ROADMAP.md
.sheaf/phases/{phase}/{plan}-PLAN.md
</required_reading>

<optional_reading>
.sheaf/execution-log.json
.sheaf/phases/{phase}/{plan}-SUMMARY.md (if regenerating)
</optional_reading>

<references>
{{SHEAF_RUNTIME_DIR}}/templates/SUMMARY.md
{{SHEAF_RUNTIME_DIR}}/references/loop-phases.md
{{SHEAF_RUNTIME_DIR}}/workflows/transition-phase.md (only when last plan in phase)
</references>

<process>

<step name="validate_preconditions" priority="first">
1. Confirm PLAN.md exists at the provided path ($PLAN_PATH)
2. Derive SUMMARY path by replacing `-PLAN.md` with `-SUMMARY.md`
3. Confirm APPLY context exists (execution log, STATE activity, or user confirmation)
4. If SUMMARY.md already exists:
   - Ask whether to regenerate or keep existing
   - Do not overwrite without explicit consent
</step>

<step name="load_plan_and_execution">
1. Read PLAN.md and extract:
   - Objective
   - Acceptance criteria
   - Tasks (files/action/verify/done)
   - Boundaries
2. Load execution evidence from available sources:
   - `.sheaf/execution-log.json` entries for this plan (if present)
   - STATE.md recent activity/decisions
   - User confirmations from APPLY session (manual done/skip/stop)
3. Build per-task outcome map using APPLY contract:
   - `agent_applied` (review_status: `accepted` or `amended_manually`)
   - `manual` (review_status: `accepted`)
   - `skipped`
   - `stopped` (if loop paused)
   - Extract any user `rationale` provided for `amended_manually`, `manual`, or `skipped` tasks.
</step>

<step name="reconcile_plan_vs_actual">
1. For each task:
   - Record planned intent vs actual outcome
   - Capture evidence (files changed, user confirmation, notes)
2. For each acceptance criterion:
   - Mark Pass / Fail / Partial
   - Add concise justification
3. Record deviations and learnings:
   - skipped work and the provided rationale
   - manual amendments and the provided rationale
   - boundary overrides
   - Perform a semantic analysis of the user's rationales. If they indicate a recurring issue (e.g., "API changed", "wrong assumption"), explicitly recommend updating project context or creating a follow-up plan.
4. Record deferred items for next plans/phases
</step>

<step name="create_summary">
Create SUMMARY.md next to PLAN.md using SHEAF SUMMARY structure.

Minimum required contents:
- Frontmatter (phase, plan, timestamps, key files/decisions when known)
- One-line shipped outcome
- Acceptance criteria results table
- Task outcome summary (manual / agent_applied / skipped)
- Files created/modified (best-known list)
- Deviations & Manual Interventions (map user rationales to the "Deviations from Plan" section, categorizing them as auto-fixed or deferred based on semantic context)
- Next-phase readiness (ready / concerns / blockers)
</step>

<step name="update_state">
Update `.sheaf/STATE.md`:
1. Current position:
   - Status: Ready to plan
   - Last activity: UNIFY complete for this plan
2. Loop position:
   ```
   PLAN ──▶ APPLY ──▶ UNIFY
     ✓        ✓        ✓     [Loop complete - ready for next PLAN]
   ```
3. Accumulated context:
   - Add key decisions/deviations (digest style)
   - Add deferred issues only if still open
4. Session continuity:
   - Stopped at: loop closed for this plan
   - Next action: `/sheaf:plan`
   - Resume context: SUMMARY path
</step>

<step name="check_phase_completion">
1. Count `*-PLAN.md` and `*-SUMMARY.md` files in current phase directory
2. If all plans have summaries:
   - Run transition workflow: `{{SHEAF_RUNTIME_DIR}}/workflows/transition-phase.md`
3. If phase still has pending plans:
   - Keep phase in progress
   - Do not run transition
</step>

<step name="confirm_and_route" priority="required">
Display concise closure report:
- Plan path
- Summary path
- AC status (pass/fail/partial counts)
- Deviations/deferred count
- Phase progress (plans unified / total)

Then provide exactly ONE next action:
- `▶ NEXT: /sheaf:plan`
</step>

</process>

<output>
- SUMMARY.md created/updated for the target plan
- STATE.md updated with closed loop position and continuity
- ROADMAP.md possibly updated via transition (if phase complete)
</output>

<error_handling>
**PLAN.md missing:**
- Stop and report exact missing path

**No APPLY evidence found:**
- Ask user for explicit execution confirmation and known outcomes
- Mark uncertainty transparently in SUMMARY.md

**SUMMARY overwrite request denied:**
- Keep existing summary and stop without changes

**State mismatch (not ready for UNIFY):**
- Warn and ask whether to reconcile anyway with explicit note
</error_handling>

<anti_patterns>
**Skipping SUMMARY creation:**
Every closed loop must produce SUMMARY.md.

**Inventing execution results:**
If evidence is missing, mark unknown/assumed explicitly.

**Partial closure:**
Do not close loop in STATE without creating/updating SUMMARY.

**Multiple next actions:**
Always end with one deterministic next step.
</anti_patterns>
