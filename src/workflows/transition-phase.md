<purpose>
Handle phase-level transition when all plans in a phase have been unified. Keep PROJECT/ROADMAP/STATE aligned and route to the next planning cycle.
</purpose>

<when_to_use>
- Current phase has matching PLAN/SUMMARY counts
- UNIFY finished for the last plan in the phase
- Need to advance to next phase (or mark milestone complete)
</when_to_use>

<required_reading>
.sheaf/STATE.md
.sheaf/PROJECT.md
.sheaf/ROADMAP.md
.sheaf/phases/{current-phase}/*-SUMMARY.md
</required_reading>

<process>

<step name="verify_phase_completion" priority="first">
1. Count `*-PLAN.md` and `*-SUMMARY.md` in current phase directory
2. If counts do not match:
   - Report phase still in progress
   - Do not transition
   - Route back to remaining plan UNIFY work
3. If counts match:
   - Continue with transition
</step>

<step name="evolve_project_digest">
Update `.sheaf/PROJECT.md` from completed phase summaries:
1. Move shipped requirements to validated section when applicable
2. Add newly discovered requirements to planned/active as needed
3. Record key decisions that affect future implementation
4. Keep project core value/current-state consistent with actual progress
</step>

<step name="update_roadmap_phase_status">
Update `.sheaf/ROADMAP.md`:
1. Mark current phase as complete with date
2. Update phase progress counts
3. Set next phase (if any) as current in-progress target
4. If no remaining phases in milestone, mark milestone complete
</step>

<step name="update_state_transition">
Update `.sheaf/STATE.md`:
1. Current position to next phase (or milestone complete)
2. Status: Ready to plan
3. Last activity: transition completed after phase closure
4. Session continuity:
   - Stopped at: phase transition complete
   - Next action: `/sheaf:plan`
   - Resume context: `.sheaf/ROADMAP.md`
5. Keep state digest concise (<100 lines target)
</step>

<step name="verify_consistency" priority="required">
Re-read STATE.md, PROJECT.md, ROADMAP.md and verify alignment:
- Current phase/milestone references match
- Status fields are coherent (no previous phase marked active)
- Progress indicators match plan/summary reality

If mismatch exists:
- Fix before route
- Do not continue with inconsistent state
</step>

<step name="confirm_and_route" priority="required">
Display concise transition report:
- Phase closed
- Files synchronized (PROJECT/ROADMAP/STATE)
- Next planning target

Then provide exactly ONE next action:
- `▶ NEXT: /sheaf:plan`
</step>

</process>

<output>
- PROJECT.md updated with phase learnings
- ROADMAP.md updated with phase completion
- STATE.md updated for next planning position
- User routed to next planning action
</output>

<success_criteria>
- [ ] PLAN/SUMMARY counts verified for phase completion
- [ ] PROJECT.md evolved from completed work
- [ ] ROADMAP.md phase/milestone status updated
- [ ] STATE.md transitioned and consistent
- [ ] Consistency verified across PROJECT/ROADMAP/STATE
- [ ] Exactly one next action shown
</success_criteria>
