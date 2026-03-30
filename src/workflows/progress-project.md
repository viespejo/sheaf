<purpose>
Provide a mid-session status checkpoint for SHEAF. Read current project state, compute progress, and route to exactly ONE next action.
</purpose>

<when_to_use>
- Mid-session progress check
- Immediately after `/sheaf:resume` when more orientation is needed
- When user is unsure about the best next step
- When user provides a constraint (time, blocker, priority) and needs adapted routing
</when_to_use>

<loop_context>
Determined from `.sheaf/STATE.md` loop markers and current position.
This workflow does not mutate loop state; it reads and routes.
</loop_context>

<philosophy>
**One-action routing:** Always suggest exactly ONE next action.
No action menus, no numbered alternatives.

**State-first:** Prefer `.sheaf/STATE.md` and `.sheaf/ROADMAP.md` over assumptions.

**Constraint-aware:** If user supplies context in `$ARGUMENTS`, adapt routing while preserving loop integrity.
</philosophy>

<required_reading>
.sheaf/STATE.md
.sheaf/ROADMAP.md
</required_reading>

<optional_reading>
.sheaf/PROJECT.md
.sheaf/config.md
</optional_reading>

<references>
{{AGENT_DIR}}/sheaf/references/loop-phases.md
{{AGENT_DIR}}/sheaf/references/context-management.md
</references>

<process>

<step name="verify_sheaf_exists" priority="first">
1. Check required files:
   ```bash
   ls .sheaf/STATE.md .sheaf/ROADMAP.md 2>/dev/null
   ```
2. If missing:
   - Report missing file(s)
   - Route user to `/sheaf:init` (if no `.sheaf`) or restore missing files
   - Stop
</step>

<step name="load_state_and_roadmap" priority="required">
Read `.sheaf/STATE.md` and `.sheaf/ROADMAP.md`, then extract:
- Milestone name/version/status
- Current phase (index/name) and total phase count
- Current plan (if present)
- Loop markers (PLAN/APPLY/UNIFY)
- Last activity and current status
- Blockers/concerns/deferred issues
- Phase progress indications from roadmap
</step>

<step name="calculate_progress">
Compute concise progress snapshot:

1. Milestone progress:
   - phases complete / total
   - percent complete (best-effort from roadmap)

2. Current phase progress:
   - plans completed (SUMMARY count) / planned
   - phase percent (best-effort)

3. Current loop status:
   - PLAN/APPLY/UNIFY marker state
   - short textual interpretation (e.g., "Ready for APPLY")
</step>

<step name="consider_user_context">
If `$ARGUMENTS` is provided, treat as routing constraint and adapt suggestion.

Examples:
- "only 30 minutes" → prefer smallest safe forward action
- "stuck on X" → route to resolve blocker first
- "finish this phase" → prioritize loop closure action
- "need to investigate bug Y" → recommend focused blocker resolution

If no argument is provided:
- Use default routing from state/loop only
</step>

<step name="determine_single_action" priority="required">
Choose exactly ONE next action.

Default routing:

| Situation | Single suggestion |
|-----------|-------------------|
| No active/approved plan | `/sheaf:plan` |
| PLAN complete, APPLY pending | `/sheaf:apply [plan-path]` |
| APPLY complete, UNIFY pending | `/sheaf:unify [plan-path]` |
| Loop complete, more roadmap work remains | `/sheaf:plan` |
| Milestone complete | `Define next milestone or ship current scope` |
| Blockers present | `Address blocker: [specific blocker]` |
| Context at DEEP/CRITICAL and work is mid-loop | `/sheaf:pause` (if available) or create handoff before continuing |

Rules:
- Never output multiple suggestions
- If `[plan-path]` is needed, resolve from STATE continuity/current position
- If path is ambiguous, ask one targeted clarification question
</step>

<step name="display_progress" priority="required">
Render concise visual status and deterministic next step:

```text
════════════════════════════════════════
SHEAF PROGRESS
════════════════════════════════════════

Milestone: [name] - [X]% complete
Phase: [N]/[M] - [phase name] ([Y]%)
Plan: [id or none]

Loop Position:
PLAN ──▶ APPLY ──▶ UNIFY
 [✓/○]    [✓/○]    [✓/○]

Last activity: [timestamp + summary]

────────────────────────────────────────
▶ NEXT: [single action]
  [one-line rationale]
────────────────────────────────────────

Type "yes" to proceed, or provide context to refine routing.
```

Do not render numbered option menus.
</step>

<step name="context_advisory">
If context capacity is known from state/handoff and indicates DEEP or CRITICAL:

```text
⚠ Context Advisory: session context is [DEEP/CRITICAL].
  Recommendation: create/refresh handoff before large new work.
```

Advisory must not replace the single next action.
</step>

</process>

<output>
- Progress snapshot (milestone/phase/loop)
- Exactly one recommended next action
- Optional context advisory for deep/critical sessions
</output>

<error_handling>
**STATE/ROADMAP parse issues:**
- Report missing/inconsistent sections
- Use best-effort routing from available fields
- Ask one clarification only if needed for safe command path

**Conflicting state vs roadmap:**
- Highlight mismatch
- Prefer STATE for immediate loop routing
- Recommend reconciliation in next planning cycle

**No active plan path when APPLY/UNIFY expected:**
- Ask one targeted question to recover plan path
- Do not fabricate path
</error_handling>
