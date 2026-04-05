---
name: sheaf:create-prd
description: Create a PRD from scratch
---

<objective>
Create comprehensive PRDs through structured workflow facilitation.
</objective>

<execution_context>
`{{RUNTIME_DIR}}/sheaf/skills/bmad-create-prd/workflow.md`
</execution_context>

<context>
`communication_language` = "English"
`document_output_language` = "English"
`planning_artifacts` = ./docs
`project_knowledge` = ".sheaf"
</context>

<process>
Load Skill in {{RUNTIME_DIR}}/sheaf/skills/bmad-create-prd/workflow.md
</process>

<success_criteria>
- [ ] The PRD workflow is executed through the `bmad-create-prd` skill in strict step-file sequence (no skipping or reordering).
- [ ] Continuation vs fresh-start state is detected correctly, and existing incomplete work is resumed through the defined continuation path.
- [ ] Step gating is respected: the agent halts at menus and only advances when the user explicitly chooses Continue.
- [ ] Required workflow state is maintained in the PRD frontmatter (including `stepsCompleted` and discovered input-document tracking when applicable).
- [ ] PRD content is built collaboratively and incrementally across the workflow steps, then polished into a coherent final document.
- [ ] The workflow ends with explicit completion confirmation, validation/next-step options, and no ambiguous routing.
</success_criteria>
