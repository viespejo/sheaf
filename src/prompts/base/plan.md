---
name: sheaf:plan
description: Plan implementation of a selected PRD story (collaborative workflow)
---

<objective>
Create or continue an implementation plan for a selected PRD story.

This is planning-first: interview, challenge, and agreement before writing files.
</objective>

<execution_context>
`{{RUNTIME_DIR}}/sheaf/workflows/plan-phase.md`
</execution_context>

<context>
$STORY: $ARGUMENTS
</context>

<process>
Follow the instructions in {{RUNTIME_DIR}}/sheaf/workflows/plan-phase.md
</process>

<success_criteria>
- [ ] Target story selected and scoped
- [ ] Interview discussion completed (options, recommendation, risks)
- [ ] Plan draft approved explicitly before file creation
- [ ] PLAN.md created at the correct phase path
- [ ] STATE.md and ROADMAP.md updated
- [ ] Exactly ONE next action shown (`/sheaf:apply`)
</success_criteria>
