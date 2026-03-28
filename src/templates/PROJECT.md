# PROJECT.md Template

Template for `.sheaf/PROJECT.md` — the project's business context and requirements.

**Purpose:** Define what we're building, why it matters, and constraints. This is the "brief" that informs planning. Init populates this from project docs (`docs/prd.md`, `docs/architecture.md`) and only asks for missing critical information.

---

## File Template

```markdown
# [Project Name]

## What This Is

[One paragraph describing what we're building. Be specific about the product/feature, not the technology.]

## Core Value

[Single sentence: What problem does this solve for whom? This is THE thing that matters.]

## Current State

| Attribute | Value |
|-----------|-------|
| Type | [Software Project (Personal)] |
| Version | [current version] |
| Status | [Prototype / MVP / Beta / Production] |
| Last Updated | [YYYY-MM-DD] |

**Production URLs:** (if applicable)
- [URL 1]: [Description]
- [URL 2]: [Description]

## Requirements

### Core Requirements

- [Core capability 1]
- [Core capability 2]
- [Core capability 3]

### Validated (Shipped)

[Requirements that have been implemented and proven]

- [x] [Requirement 1] — [version shipped]

### Active (In Progress)

[Requirements currently being worked on]

- [ ] [Requirement 1] — [status/notes]

### Planned (Next)

[Requirements queued for upcoming work]

- [ ] [Requirement 1]

### Out of Scope

[Explicitly excluded requirements — important for preventing scope creep]

- [Excluded feature 1] — [reason]

## Target Users

**Primary:** [Who is the main user]
- [Key characteristic 1]
- [Key characteristic 2]
- [Their main goal/need]

**Secondary:** [Other users, if applicable]
- [Characteristics]

## Context

**Business Context:**
[Relevant business information — market, partners, strategy]

**Technical Context:**
[Relevant technical information — existing systems, integrations, constraints]

## Constraints

### Technical Constraints

<!-- Examples:
     deployment/platform limits, framework constraints, auth requirements,
     external API dependencies, performance and operability limits -->

- [Constraint 1]
- [Constraint 2]

### Business Constraints

<!-- Examples:
     timeline limits, budget constraints, dependency commitments,
     approval bottlenecks, legal/process constraints -->

- [Constraint 1]
- [Constraint 2]

### Compliance Constraints
- [Constraint 1: e.g., "GDPR data handling required"]

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| [What was decided] | [Why] | [YYYY-MM-DD] | Active / Superseded |

## Success Metrics

<!-- Examples:
     delivery quality metrics, reliability/error-rate targets,
     throughput/latency targets, adoption or outcome KPIs -->

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| [Metric 1] | [Target value] | [Current value] | [On track / At risk / Achieved] |

## Tech Stack / Tools

<!-- Record the actual stack/tools in use:
     runtime, framework, database, hosting, CI/CD, observability,
     integrations, and any architecture-critical services -->

| Layer | Technology | Notes |
|-------|------------|-------|
| [Layer/Category] | [Tool/Technology] | [Why this choice] |

## Links

| Resource | URL |
|----------|-----|
| Repository | [URL] |
| Production | [URL] |
| Documentation | [URL] |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: [YYYY-MM-DD]*
```

---

## Section Specifications

### What This Is
**Purpose:** Concrete description of the product/feature.
**Length:** One paragraph.
**Focus:** What it is, not how it's built.

### Core Value
**Purpose:** The ONE thing that matters. Used to guide all decisions.
**Format:** Single sentence answering "What problem for whom?"
**Example:** "Attorneys can make informed accept/reject decisions on cases in under 2 minutes without reading raw documents."

### Core Requirements
**Purpose:** The 3-5 primary capabilities this project delivers. Populated during INIT from docs and clarified during planning.
**Why:** Plans that reference specific capabilities produce better acceptance criteria than placeholders.

### Requirements
**Purpose:** Track feature state across development.
**Categories:**
- **Core Requirements:** Top-level project capabilities (populated during init)
- **Validated:** Shipped and proven
- **Active:** Currently being implemented
- **Planned:** Queued for future
- **Out of Scope:** Explicitly excluded (prevents scope creep)

### Target Users
**Purpose:** Who we're building for.
**Include:** Characteristics, goals, needs.
**Why:** Prevents building for imaginary users.
**Note:** Primary user is typically the project owner. Add secondary users only when relevant.

### Constraints
**Purpose:** Hard limits on solutions.
**Categories:**
- Technical (platform, architecture, integration requirements)
- Business (timeline, budget, dependency constraints)
- Compliance (legal, regulatory, security)
**Note:** Capture only hard limits that affect planning decisions.

### Key Decisions
**Purpose:** Record of significant decisions.
**Include:** What, why, when, status (Active/Superseded).
**Integration:** Can sync with decision-logger MCP.
**Note:** Init captures any explicit decisions found in project docs (stack, architecture, operating constraints).

### Success Metrics
**Purpose:** Measurable outcomes.
**Include:** Target values and current state.
**Note:** Prefer objective technical and product outcomes that indicate real progress.
**Why:** Objective success criteria prevent endless scope expansion.

### Tech Stack / Tools
**Purpose:** What technologies and platforms are involved.
**Note:** Capture the real stack from project docs and update as architecture evolves.
