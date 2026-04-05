---
name: sheaf:product-brief
description: Create or update product briefs through guided or autonomous discovery. Use when the user requests to create or update a Product Brief.
---

<objective>
Create compelling product briefs through collaborative discovery, intelligent artifact analysis, and web research.
</objective>

<execution_context>
`{{SHEAF_RUNTIME_DIR}}/skills/bmad-product-brief/SKILL.md`
</execution_context>

<context>
`arguments` = $ARGUMENTS
`communication_language` = "English"
`document_output_language` = "English"
`planning_artifacts` = ./docs
`project_knowledge` = ".sheaf"
</context>

<process>
Load Skill in {{SHEAF_RUNTIME_DIR}}/skills/bmad-product-brief/SKILL.md
</process>

<success_criteria>
- [ ] Understand the user's intent for the product brief
- [ ] Conduct contextual discovery by analyzing available artifacts and performing web research
- [ ] Use guided elicitation to fill in any gaps in understanding through smart questioning
- [ ] Draft the product brief
- [ ] Finalize the product brief, polish it, and offer a distilled version if appropriate
</success_criteria>
