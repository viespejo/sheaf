<purpose>
Create an executable PLAN.md focused on implementing one selected PRD story.
Planning is collaborative-first: discuss and agree in chat before writing files.
</purpose>

<when_to_use>
- First implementation plan after `/sheaf:init`
- New plan for the next story in the active roadmap phase
- Re-planning after UNIFY closes the prior loop
- Resuming unfinished planning discussion
</when_to_use>

<loop_context>
Expected phase: PLAN
Prior phase: UNIFY complete (or none for first plan)
Next phase: APPLY
</loop_context>

<required_reading>
.sheaf/STATE.md
.sheaf/ROADMAP.md
.sheaf/PROJECT.md
.sheaf/phases/{prior-phase}/{plan}-SUMMARY.md (only if relevant)
</required_reading>

<optional_on_demand_reading>
docs/prd.md
docs/architecture.md
PLANNING.md (if present)
</optional_on_demand_reading>

<references>
{{RUNTIME_DIR}}/sheaf/references/plan-format.md
{{RUNTIME_DIR}}/sheaf/templates/PLAN.md
</references>

<continuity_rules>
- INIT artifacts are primary source of truth for planning
- Do not re-run full discovery from PRD/architecture on every PLAN
- Use PRD/architecture only when ambiguity, conflict, or missing detail appears
- Focus on implementation planning for the selected story
- End with exactly ONE next action
</continuity_rules>

<process>

<step name="validate_preconditions" priority="first">
1. Read `.sheaf/STATE.md` and confirm loop is ready for PLAN:
   - first plan, or
   - previous plan closed through UNIFY
2. If APPLY/UNIFY is incomplete:
   - Warn user and stop until loop is closed/reset
3. If STATE.md missing:
   - Ask user to run `/sheaf:init` (or recover STATE.md)
   - Stop
</step>

<step name="identify_phase_and_story">
1. Read `.sheaf/ROADMAP.md` and identify active/next phase
2. Ask user to select target story for this plan (or confirm the story from `$STORY`)
3. Confirm story boundary:
   - in scope
   - explicitly out of scope
4. If ROADMAP.md missing:
   - Ask user to initialize/recover roadmap
   - Stop
</step>

<step name="load_context">
Load only context needed for this story implementation:
1. `.sheaf/PROJECT.md` (constraints, decisions, value)
2. `.sheaf/STATE.md` (recent decisions, open risks)
3. `.sheaf/ROADMAP.md` (phase scope/dependencies)
4. Relevant prior SUMMARY files when they affect this story
5. Relevant source files

Only if required for ambiguity/conflict/missing details:
6. `docs/prd.md`
7. `docs/architecture.md`
8. `PLANNING.md` (if present)
</step>

<step name="collaborative_interview" priority="required">
Run planning interview before writing files.

Goal: agree implementation approach for the selected story.

For each major decision, use this structure:
```text
[Planning Decision N]
Story: <story id/title>
Decision area: <api/data/ui/testing/deployment/etc>
Why it matters: <impact>

Recommendation:
<preferred option + rationale>

Pros:
- ...

Cons:
- ...

Devil's advocate:
- <strong objection or failure mode>

Risks:
- Risk: <description>
  Probability: <low/med/high>
  Impact: <low/med/high>
  Mitigation: <action>

Decision status:
- accepted | rejected | parked

Notes:
- assumptions
- dependencies
- follow-up checks
```

Rules:
- One decision at a time
- Do not jump to file generation while decisions are unresolved
- If uncertainty remains, consult PRD/architecture on-demand
</step>

<step name="build_draft_plan" priority="required">
Create PLAN draft in chat only (no writes yet):
- objective (story implementation outcome)
- acceptance criteria (Given/When/Then)
- tasks (files/action/verify/done)
- boundaries (out-of-scope)
- verification checklist
- risk register (top risks + mitigations)

If scope is too large for one plan, propose split and ask confirmation.
</step>

<step name="approval_gate" priority="required">
Ask explicitly:
"Approve this plan draft for materialization? (yes/no)"

If no:
- continue interview refinement
- regenerate draft

If yes:
- proceed to create PLAN.md and update state
</step>

<step name="create_plan_after_approval" priority="required">
After approval only:
1. Create phase directory `.sheaf/phases/{NN}-{phase-name}/`
2. Generate PLAN.md using template structure:
   - frontmatter: phase, plan, type, wave, depends_on, files_modified, autonomous
   - sections: objective, context, acceptance_criteria, tasks, boundaries, verification, success_criteria, output
3. Ensure each task has files + action + verify + done (linked to AC)
</step>

<step name="coherence_check">
Run lightweight coherence validation before finalizing:
1. PROJECT.md constraints alignment
2. STATE.md decisions consistency
3. ROADMAP phase scope alignment
4. Recent summary overlap awareness

If issues exist, present them and request explicit acknowledgement.
</step>


<step name="update_state" priority="required">
1. Update `.sheaf/STATE.md` with:
   - plan created and awaiting execution
   - session continuity
   - assumptions and deferred validations
2. Update `.sheaf/ROADMAP.md` statuses as needed:
   - milestone to in-progress (if first plan)
   - phase to planning/in-progress accordingly
</step>

<step name="confirm_and_route" priority="required">
Display concise summary:
- selected story
- plan path
- key tasks
- key risks

Then provide exactly ONE next action:
- `▶ NEXT: /sheaf:apply [plan-path]`

</step>

</process>

<output>
PLAN.md at `.sheaf/phases/{NN}-{phase-name}/{NN}-{plan}-PLAN.md`

Example: `.sheaf/phases/04-workflows-layer/04-01-PLAN.md`
</output>

<error_handling>
**STATE.md missing:**
- Ask user to run `/sheaf:init` or restore STATE.md
- Stop

**ROADMAP.md missing:**
- Ask user to initialize/recover ROADMAP.md
- Stop

**Story unclear or missing details:**
- Consult PRD/architecture on-demand
- Continue interview until decision quality is sufficient

**Plan not approved:**
- Do not write PLAN.md
- Stay in interview/refinement mode
</error_handling>

