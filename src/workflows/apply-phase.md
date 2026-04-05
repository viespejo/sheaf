<purpose>
Execute an approved PLAN.md by presenting per-task preview fragments and requiring an explicit per-task decision from the user (manual apply / SHEAF apply / skip). Records results for UNIFY phase reconciliation.
</purpose>

<when_to_use>
- User has approved a PLAN.md (explicit approval required)
- STATE.md shows loop position at PLAN complete, ready for APPLY
- No unresolved blockers from planning phase
</when_to_use>

<loop_context>
Expected phase: APPLY
Prior phase: PLAN (approval just received)
Next phase: UNIFY (after execution completes)
</loop_context>

<required_reading>
.sheaf/STATE.md
.sheaf/phases/{phase}/{plan}-PLAN.md
</required_reading>

<references>
`{{SHEAF_RUNTIME_DIR}}/references/loop-phases.md`
</references>

<process>

<step name="validate_approval" priority="first">
1. Confirm user has explicitly approved the plan
   - Do NOT assume approval — instead, look for an explicit signal ("approved", "execute", "go ahead"), because executing on assumed approval may implement against flawed assumptions that approval review would have caught
   - If approval unclear: Ask "Plan ready at [path]. Approve execution?" and wait
2. Read STATE.md to verify:
   - Loop position shows PLAN complete
   - Correct phase and plan identified
</step>

<step name="load_plan">
1. Read the PLAN.md file
2. Parse frontmatter:
   - execution_mode: (optional) may hint default behavior
   - files_modified: track what we'll change
   - depends_on: informational
3. Extract tasks from <tasks> section
4. Note boundaries from <boundaries> section
5. Load acceptance criteria for informational reference
</step>

<step name="execute_tasks">
**For each <task> in order, present a preview fragment and require an explicit user decision.**

**Notes:**
- SHEAF will present planned changes using a context-rich, unified code block format for easy review.
- Decision is mandatory per task.

---

**For each <task>:**

**1. PREPARE PREVIEW FORMAT (no file writes)**
- Determine target files from <files> or action spec.
- For each target file, present the planned changes using a unified code block format:
  - Do NOT show the entire file unless it is very small (< 20 lines) or newly created.
  - Show the specific block of code being changed, including 5-10 lines of surrounding context above and below the change.
  - Use language-specific comments to indicate unchanged code (e.g., `// ... existing code ...` or `# ... existing code ...`).
  - Enclose the code block in 4 backticks (````).
  - Immediately following the opening backticks, specify the language ID and the relative file path to provide context (e.g., ````javascript {src/components/Button.jsx}`).
- Collect a short action summary and the suggested verify command (if task defines <verify>), shown as guidance only.

**2. DISPLAY PREVIEW & PROMPT FOR DECISION (OBLIGATORY)**
- Show:
  - Task header: "Task N: [name]"
  - Files affected
  - For each file: the context-rich preview block formatted exactly as described above.
  - Suggested verify command (informational)
- Mandatory choices:
  - [1] I have applied these changes manually (continue, optionally append rationale: "1 fixed API")
  - [2] SHEAF: apply these changes now (SHEAF will write files and enter Review Loop)
  - [3] Skip this task (continue, optionally append rationale: "3 not needed")
- Wait for user's exact choice.

**3. HANDLE CHOICE**
- **If [1] (manual):**
  - SHEAF assumes the user has already made the necessary edits in their editor while reviewing the preview.
  - SHEAF does NOT write files and does not need to show further apply instructions.
  - **Frictionless logging:** SHEAF extracts any optional rationale directly from the user's menu choice message (e.g., if user replies "1 because API changed", rationale is "because API changed"). Do NOT prompt separately for rationale.
  - SHEAF logs: `{task, decision: manual, review_status: accepted, rationale, timestamp}`.
  - Continue to next task.
- **If [2] (agent applies):**
  - SHEAF writes fragments into files (respect boundaries).
  - If a write would violate a protected boundary, SHEAF stops and requires explicit override; do not apply without consent.
  - **ENTER POST-APPLY REVIEW LOOP:**
    - Show applied-change summary (files touched).
    - Prompt for post-apply review:
      - [A] Accept task result and continue
      - [B] I have manually amended this task (continue, optionally append rationale: "B fixed typo")
    - Wait for user choice.
    - If [A]: log `{task, decision: agent_applied, review_status: accepted, timestamp}`.
    - If [B]: **Frictionless logging:** extract optional rationale directly from the user's message (e.g., "B fixed typo in variable name"). Do NOT prompt separately for rationale. Log `{task, decision: agent_applied, review_status: amended_manually, rationale, timestamp}`.
  - Continue to next task.
- **If [3] (skip):**
  - SHEAF logs: {task, decision: skipped, reason: user_skip, timestamp}.
  - Continue to next task.

**4. SAFEGUARDS**
- Do not modify protected files without explicit override; record overrides in STATE.md Decisions.
- For sensitive operations (service restarts, permissions) show explicit warning and require confirmation.

**5. LOGGING**
- After each task decision, append an entry to .sheaf/execution-log.json (or a structured section in STATE.md) including: task id/name, decision, timestamp, optional user notes.
</step>

<step name="track_progress">
Throughout execution:

1. Maintain log of:
   - Tasks processed with decision (manual/agent_applied/skipped)
   - Deviations from plan
   - Any boundary override decisions
2. This log feeds the UNIFY phase to reconcile manual edits with plan intent.
</step>

<step name="finalize">
After all tasks attempted:

1. Summarize execution:
   - Tasks completed: N of M
   - Tasks applied by agent: count
   - Tasks applied manually: count
   - Skipped/deviations: list
2. Update STATE.md:
   - Loop position: PLAN → APPLY → UNIFY
   - Last activity: timestamp and summary
3. Prompt:
   ```
   ════════════════════════════════════════
   APPLY COMPLETE
   ════════════════════════════════════════
   [execution summary]

   ---
   Start a new clean session to run UNIFY: /sheaf:unify [plan-path]
   ```
</step>

</process>

<output>
- Files modified only where SHEAF was instructed to apply changes (agent_applied)
- Execution log (for UNIFY): task decisions, deviations
- STATE.md updated with APPLY progress/complete
</output>

<error_handling>
**Plan not found:**
- Check STATE.md for correct path
- Ask user to confirm plan location

**Boundary violation attempted:**
- Stop immediately and request explicit override
- Do not modify protected files without explicit override; record override decision

**User never confirms manual application:**
- If the user is unresponsive during a prompt, offer "save and exit" to continue later.
</error_handling>

<anti_patterns>
**Assuming approval:**
Do NOT start APPLY without explicit user approval — instead wait for clear signal, because plans may contain incorrect assumptions that the approval step would catch.

**Skipping verification by default:**
Qualify removed; SHEAF will show verify commands as suggestions only — running them is user's responsibility.

**Ignoring boundaries:**
Stop until user authorizes — instead of rationalizing "it's a small change", because boundary violations cascade into untraceable changes.

**Swallowing concerns:**
Record any user-reported concerns in logs; never mark implicitly complete without confirmation.
</anti_patterns>

