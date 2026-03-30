---
paths:
  - "src/templates/**/*.md"
---

# Template Rules

Rules for editing document templates in `src/templates/`.

## File Purpose

Template files define the canonical structure of generated SHEAF artifacts.

Primary outputs include:
- PLAN.md
- SUMMARY.md
- STATE.md
- ROADMAP.md
- PROJECT.md

## Recommended Template File Structure

1. Title (`# [NAME].md Template`)
2. Short purpose and naming guidance
3. `## File Template` block containing the generated markdown shape
4. Field/section documentation tables
5. Examples and anti-patterns

## Placeholder Conventions

Use square brackets for human-filled placeholders:

```
[Project Name]
[Specific implementation instruction]
```

Use curly braces for computed interpolation values:

```
{phase}-{plan}-PLAN.md
.sheaf/phases/{phase-number}-{name}/
```

## Frontmatter Guidance

When generated artifact includes frontmatter (for example PLAN), show it as template content.

Template file itself should not use frontmatter unless explicitly required by SHEAF runtime.

## Task Structure Requirements (PLAN templates)

For executable plan tasks, ensure each actionable task has:
- `<name>`
- `<files>`
- `<action>`
- `<verify>`
- `<done>`

Reject vague task templates that omit these fields.

## SHEAF Path Consistency

Use `.sheaf/` paths in template examples.

## Practical Constraints

- Prefer deterministic, parse-friendly structure.
- Keep section names stable to support workflow parsing.
- Keep examples realistic and concise.
