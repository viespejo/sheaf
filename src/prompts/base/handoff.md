---
name: sheaf:handoff
description: Generate a comprehensive session handoff document for the next resume
---

<objective>
Generate a comprehensive handoff document that captures session outcomes, decisions, open gaps, and prioritized next actions.

Use this at end of session, before context break, or when continuity quality matters.
</objective>

<execution_context>
`{{AGENT_DIR}}/sheaf/workflows/handoff-project.md`
`{{AGENT_DIR}}/sheaf/references/context-management.md`
</execution_context>

<context>
Optional notes: $ARGUMENTS

Session context (primary source)
.sheaf/STATE.md
</context>

<process>
**Follow workflow: {{AGENT_DIR}}/sheaf/workflows/handoff-project.md**

Core flow:
1. Load current state snapshot
2. Extract session signals from conversation and state
3. Synthesize accomplishments, decisions, gaps, and open questions
4. Generate `.sheaf/HANDOFF-{date}-{context}.md`
5. Confirm save path and key counts

Behavior rules:
- Prefer observed session context over generic placeholders
- Integrate optional `$ARGUMENTS` notes as override/supplement
- Keep handoff actionable for `/sheaf:resume`
</process>

<success_criteria>
- [ ] Current state loaded from `.sheaf/STATE.md`
- [ ] Session signals extracted from conversation
- [ ] Optional inline notes incorporated
- [ ] Structured handoff file created in `.sheaf/`
- [ ] Prioritized next actions included
- [ ] Resume instruction included (`/sheaf:resume`)
</success_criteria>
