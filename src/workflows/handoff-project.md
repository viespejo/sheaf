<purpose>
Create a high-quality SHEAF session handoff document that preserves continuity across sessions. Synthesize state, session outcomes, decisions, gaps, and prioritized next actions.
</purpose>

<when_to_use>
- End of work session
- Before expected context loss or session reset
- Before pausing unresolved work
- When decisions/deviations must be documented for reliable resume
</when_to_use>

<loop_context>
Read-only for loop state. This workflow documents continuity and does not advance PLAN/APPLY/UNIFY by itself.
</loop_context>

<philosophy>
**Continuity over verbosity:** capture what the next session needs to act safely.

**Observed evidence first:** use STATE + session evidence first; use user notes as supplement/override.

**Resume-ready output:** handoff should allow `/sheaf:resume` to recover momentum immediately.
</philosophy>

<required_reading>
.sheaf/STATE.md
</required_reading>

<optional_reading>
.sheaf/ROADMAP.md
.sheaf/PROJECT.md
.sheaf/execution-log.json
</optional_reading>

<references>
{{AGENT_DIR}}/sheaf/references/context-management.md
{{AGENT_DIR}}/sheaf/references/loop-phases.md
</references>

<process>

<step name="verify_prerequisites" priority="first">
1. Check `.sheaf/STATE.md` exists:
   ```bash
   ls .sheaf/STATE.md 2>/dev/null
   ```
2. If missing:
   - Report: "No SHEAF state found. Run /sheaf:init first or restore STATE.md."
   - Stop
</step>

<step name="gather_session_context" priority="required">
Collect context from three sources:

1. From `.sheaf/STATE.md`:
   - milestone/phase/plan
   - loop position
   - status + last activity
   - session continuity section
   - blockers/deferred issues

2. From session conversation evidence:
   - files created/modified this session
   - plans executed or prepared
   - explicit decisions and approvals
   - unresolved questions and identified gaps
   - user intent statements and constraints

3. From optional `$ARGUMENTS` notes:
   - additional details user wants included
   - overrides/supplements to inferred context
</step>

<step name="synthesize_handoff_content" priority="required">
Build structured handoff payload:

1. Session accomplishments
   - what was completed this session
   - artifacts created/updated

2. Decisions made
   - explicit and implicit decisions
   - rationale and expected impact

3. Gap analysis with decisions
   - missing items or known holes
   - chosen status per gap: CREATE | DEFER | INTENTIONAL
   - effort estimate when available

4. Open questions
   - unresolved decisions requiring follow-up

5. Reference files for next session
   - files that should be read first

6. Prioritized next actions
   - 1..N actionable items with rough effort
   - first action should align with loop position
</step>

<step name="derive_handoff_path">
Generate path:
- `.sheaf/HANDOFF-{YYYYMMDD-HHMM}-{context}.md`

Context slug rules:
- derive from phase/plan and short activity label when possible
- lowercase, kebab-case
- fallback: `session`
</step>

<step name="generate_handoff_file" priority="required">
Create handoff document:

```markdown
# SHEAF Session Handoff

**Session:** {date} {start_time} - {end_time}
**Phase:** {current_phase}
**Plan:** {plan_or_none}
**Context:** {brief context}

---

## Session Accomplishments

- ...

---

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| ... | ... | ... |

---

## Gap Analysis with Decisions

### {Gap Name}
**Status:** CREATE / DEFER / INTENTIONAL
**Notes:** {decision and rationale}
**Effort:** {if known}
**Reference:** @{file_path_if_any}

---

## Open Questions

- ...

---

## Reference Files for Next Session

```text
.sheaf/STATE.md
...
```

---

## Prioritized Next Actions

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | ... | S/M/L |

---

## State Summary

**Current:** {phase, plan, loop position}
**Next:** {single recommended next action}
**Resume:** `/sheaf:resume` then read this handoff

---

*Handoff created: {timestamp}*
```
</step>

<step name="update_state_continuity">
Update `.sheaf/STATE.md` Session Continuity section:
- Last session timestamp
- Stopped at summary
- Next action (single best action)
- Resume context: generated handoff path

Do not alter loop completion markers unless they were already changed by PLAN/APPLY/UNIFY workflows.
</step>

<step name="confirm_output" priority="required">
Display concise confirmation:

```text
════════════════════════════════════════
HANDOFF CREATED
════════════════════════════════════════

Saved: .sheaf/HANDOFF-{date}-{context}.md

Includes:
- {N} accomplishments
- {N} decisions
- {N} gaps with status
- {N} prioritized next actions

Next session: /sheaf:resume
════════════════════════════════════════
```
</step>

</process>

<smart_context_detection>
Decision indicators:
- "I want to..."
- "Let's do..."
- "Decision:"
- approval signals ("yes", "approved", "go")

Gap indicators:
- "missing"
- "need"
- "gap"
- "TODO"

Priority indicators:
- numbered action lists
- "first", "most important"
- effort/impact comparisons
</smart_context_detection>

<output>
- `.sheaf/HANDOFF-{date}-{context}.md`
- Updated `.sheaf/STATE.md` session continuity with handoff pointer
</output>

<error_handling>
**No reliable session evidence:**
- still create handoff using STATE snapshot
- mark low-confidence sections explicitly

**Conflicting signals (conversation vs state):**
- prefer state for loop position
- note conflict in Open Questions

**Path collision (handoff filename exists):**
- append numeric suffix `-01`, `-02`, ...
- do not overwrite silently
</error_handling>
