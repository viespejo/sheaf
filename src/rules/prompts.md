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
interaction: chat
opts:
  alias: sheaf_command_name
  auto_submit: false
  is_slash_cmd: true
  user_prompt: true # optional
  ignore_system_prompt: true # optional
---
```

Required fields:
- `name` with `sheaf:` prefix
- `description`
- `interaction`
- `opts.alias`
- `opts.auto_submit`
- `opts.is_slash_cmd`

Optional fields:
- `opts.user_prompt` when command should require user prompt input flow
- `opts.ignore_system_prompt` when command should not include default system prompt

## Body Structure

Prompt body should follow this order:

1. `## user`
2. `@{agentic}`
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

Use SHEAF paths and loop terms.

```markdown
<execution_context>
`{{RUNTIME_DIR}}/sheaf/workflows/plan-phase.md`
`{{RUNTIME_DIR}}/sheaf/templates/PLAN.md`
`{{RUNTIME_DIR}}/sheaf/references/plan-format.md`
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
