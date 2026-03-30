---
paths:
  - "src/workflows/**/*.md"
---

# Workflow Rules

Rules for editing execution workflows in `src/workflows/`.

## No Frontmatter

Workflow files do not use YAML frontmatter.

Start with semantic XML sections.

## Required Sections

Every workflow must include:

1. `<purpose>`
2. `<when_to_use>`
3. `<process>`

## Recommended Sections

Use when relevant:
- `<loop_context>`
- `<required_reading>`
- `<optional_on_demand_reading>`
- `<references>`
- `<continuity_rules>`
- `<output>`
- `<error_handling>`
- `<anti_patterns>`

## Step Conventions

Inside `<process>`, define steps with semantic names:

```xml
<step name="load_project_state" priority="first">
  1. Read .sheaf/STATE.md
  2. Validate loop position and preconditions
</step>
```

Rules:
- `name` uses snake_case
- `priority` is optional (`first`, `required`, etc.)
- content is imperative and operational

## Loop Discipline

Workflows must enforce SHEAF loop invariants:

- never skip PLAN,
- never run APPLY without explicit approval,
- never skip UNIFY after APPLY completion.

If loop state is invalid, stop and route user to recovery action.

## Per-Command Determinism

Each workflow should end with one clear routing outcome whenever possible.

Examples:
- PLAN workflow routes to `/sheaf:apply [plan-path]`
- UNIFY workflow routes to `/sheaf:plan`

## Context Loading

Load minimal required context first:
- `.sheaf/STATE.md`
- `.sheaf/ROADMAP.md`
- `.sheaf/PROJECT.md`

Load heavy docs (`docs/prd.md`, `docs/architecture.md`) only on ambiguity/conflict.

## Path Conventions

Use SHEAF paths consistently:
- project state at `.sheaf/*`
- shared framework docs at `{{RUNTIME_DIR}}/sheaf/*`

## Key Principle

Workflows contain detailed "how" logic.

Prompt commands remain concise wrappers that delegate to these workflows.
