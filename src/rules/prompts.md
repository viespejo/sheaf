---
paths:
  - "src/prompts/**/*.md"
---

# Prompt Command Rules

Rules for editing slash command prompt files in `src/prompts/`.

## Scope

SHEAF command entrypoints are prompt files (`/sheaf:*`).

Commands are implemented as prompt contracts that delegate execution logic to workflows.

## File Structure (Frontmatter)

Use YAML frontmatter compatible with current SHEAF prompts:

```yaml
---
name: sheaf:command-name
description: One-line description
---
```

Required fields:
- `name` with `sheaf:` prefix
- `description`

## Body Structure

Prompt body should follow this order:

3. `<objective>`
4. `<execution_context>`
5. `<context>`
6. `<process>`
7. `<success_criteria>`

## Core Principle

**Prompt commands are thin wrappers.**

- Prompt command: defines intent, context, and routing.
- Workflow: defines detailed execution logic.

If logic grows large, move it to `src/workflows/*.md` and reference it.

## SHEAF Context Conventions

Use SHEAF paths.

```markdown
<execution_context>
`{{SHEAF_RUNTIME_DIR}}/workflows/plan-phase.md`
`{{SHEAF_RUNTIME_DIR}}/templates/PLAN.md`
`{{SHEAF_RUNTIME_DIR}}/references/plan-format.md`
</execution_context>

<context>
$ARGUMENTS

.sheaf/PROJECT.md
.sheaf/STATE.md
.sheaf/ROADMAP.md
</context>
```

## Process Content Rules

- Keep process concise; point to the workflow for implementation details.
- State approval gates explicitly when relevant (especially PLAN/APPLY).
- Preserve the one-next-action invariant.

## Success Criteria Format

Use objective checklist format:

```xml
<success_criteria>
- [ ] Specific, measurable criterion
- [ ] Another verifiable outcome
</success_criteria>
```

Each item must be directly verifiable.

## Naming Conventions

- Command names: `sheaf:kebab-case` (example: `sheaf:unify`)
- Prompt filenames: `kebab-case.md` (example: `progress.md`)
- Step names in `<step name="...">`: `snake_case`
