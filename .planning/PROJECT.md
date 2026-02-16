# Google Ads Lifecycle Interactive Study Tool

## What This Is

A single-file interactive HTML workflow diagram for studying the complete Google Ads lifecycle. Features drill-down tree structures, heat map priority visualization based on interview importance, tabbed detail modals, and a Claude prompt generator. Built for active study preparation for the Google gTech Ads Technical Solutions Consultant interview.

## Core Value

Visual, interactive understanding of the 8-phase Google Ads lifecycle with clear priority indicators so study time is focused on what matters most for the interview.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 8 main phase nodes render horizontally with SVG arrow connections
- [ ] Heat map coloring by interview priority (critical/important/awareness)
- [ ] Click to expand tree structures with unlimited nesting depth
- [ ] Double-click opens detail modal with 4 tabs (Overview, Technical, Troubleshooting, Related Tools)
- [ ] Satellite nodes with curved dashed connectors for tools (GTM, GA4, BigQuery)
- [ ] Floating help button generates context-aware Claude prompts
- [ ] Global controls: Expand All / Collapse All / Priority Filter / Zoom
- [ ] Phase jump navigation in header
- [ ] Smooth animations for expand/collapse and modal transitions
- [ ] Mobile responsive layout (vertical stack on small screens)

### Out of Scope

- API integration with Claude — clipboard-based prompt generation is simpler and sufficient
- Multi-file architecture — single HTML file for maximum portability
- Real-time collaboration — personal study tool only
- Backend/database — all data embedded in JSON within HTML file
- Quick reference during interview — optimized for study depth, not lookup speed

## Context

**Interview:** Google gTech Ads Technical Solutions Consultant, Round 1 on Feb 19, 2026

**Study Materials Available:**
- Comprehensive AI-generated study guides (Claude, ChatGPT, Gemini)
- Official Google Ads 101 deck
- Interview prep conversation transcript with current Google employee
- Mind maps and Draw.io diagrams of lifecycle
- 5-day study plan with priority tiers

**Priority Framework:**
- `must_know_cold` (Phases 3, 4, 5): Ad Auction, Ad Serving & Click, Conversion Tracking
- `know_well` (Phases 1, 2, 7): Account Setup, Targeting & Bidding, Analysis & Optimization
- `conceptual_awareness` (Phases 6, 8): Data Pipelines, AI/ML & Competitive

**Existing Work:**
- Design document: `docs/plans/2026-02-15-google-ads-workflow-study-tool-design.md`
- Implementation plan: `docs/plans/2026-02-15-google-ads-workflow-implementation-plan.md`

## Constraints

- **Tech Stack**: Single HTML file with embedded CSS, JS, and JSON data — no build process, no dependencies
- **Timeline**: Interview on Feb 19, 2026 — tool needed for active study before then
- **Portability**: Must work by double-clicking file in any browser — no server required
- **Content Source**: Data structure defined in implementation plan, content derived from existing study materials

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| CSS Grid + SVG overlay approach | Best balance of maintainability (HTML nodes) and visual fidelity (SVG arrows) | — Pending |
| Modal overlay vs zoom-into-diagram | User preference for simplicity; zoom would require complex debugging | — Pending |
| Clipboard prompt generation vs API | No API key needed, simpler implementation, user maintains control | — Pending |
| Heat map + border thickness for priority | Visual system that shows priority at a glance without reading labels | — Pending |
| Inline tree expansion vs replace-view | Keeps context visible while drilling down, matches mental model of exploration | — Pending |

---
*Last updated: 2026-02-15 after project initialization*
