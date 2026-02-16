# Google Ads Lifecycle Study Tool - React Flow Migration Design

**Created:** 2026-02-15
**Approach:** Content-First, Then React Migration (Approach C)
**Interview Date:** 2026-02-19

---

## Executive Summary

Rebuild the Google Ads Lifecycle study tool in two phases:
1. **Phase 1 (Content):** Generate comprehensive `lifecycle_data.json` with all 8 phases, 54+ sub-processes, 218+ technical concepts, and troubleshooting decision trees
2. **Phase 2 (UI):** Build React Flow + Tailwind CSS application consuming the JSON with professional drag/drop, auto-layout, and polished visuals

---

## Problem Statement

Current implementation gaps:
- Content at ~20% of required depth (Phases 4, 5, 6 critically lacking)
- No drag functionality
- Arrows smashed together / visually unclear
- Generic content not tied to Google Ads lifecycle context
- No troubleshooting decision trees
- Sidebar panels not implemented

---

## Phase 1: Content Generation

### Goal
Generate `lifecycle_data.json` with complete lifecycle data derived from Prompt_1A, 1B, 1C specifications.

### Data Schema

#### Root Structure
```json
{
  "meta": {
    "title": "Google Ads Lifecycle",
    "version": "2.0",
    "lastUpdated": "2026-02-15",
    "interviewDate": "2026-02-19"
  },
  "phases": [...],
  "crossCutting": {
    "googleEcosystem": [...],
    "competitors": [...],
    "privacyConsent": [...]
  }
}
```

#### Phase Node Schema
```json
{
  "id": "phase-4",
  "name": "Ad Serving & Click",
  "phaseNumber": 4,
  "priority": "must_know_cold",
  "category": "web_tech",
  "funnelStage": "Intent / Action",
  "summary": "What happens from ad impression to landing page load",
  "adsContext": "This is the highest-weight interview area. TSCs troubleshoot landing page issues, tracking failures, and performance problems.",
  "dataFlowIn": "Ad wins auction position",
  "dataFlowOut": "GCLID set in cookie, page rendered, tags ready to fire",
  "children": [...]
}
```

#### Sub-Process Node Schema
```json
{
  "id": "P4.3",
  "name": "DNS Resolution",
  "parentId": "phase-4",
  "priority": "must_know_cold",
  "category": "web_tech",
  "definition": "The process of translating a domain name to an IP address via recursive DNS queries.",
  "adsContext": "DNS latency directly impacts landing page load time, which affects Quality Score's Landing Page Experience component. Slow DNS = lower Ad Rank.",
  "tscRelevance": "TSCs troubleshoot 'slow landing page' complaints by checking DNS resolution time via Chrome DevTools Network tab or dig/nslookup.",
  "keyDetails": [
    "TTL (Time-to-Live) determines cache duration - lower TTL = faster changes but more lookups",
    "Anycast routing directs queries to geographically nearest DNS server",
    "Chrome prefetches DNS for links visible on page (dns-prefetch)",
    "CDNs use DNS to route to nearest edge server"
  ],
  "interviewQuestions": [
    "What happens during DNS resolution when a user clicks an ad?",
    "How does DNS caching affect landing page performance?",
    "What's the difference between recursive and iterative DNS queries?"
  ],
  "sqlConnection": null,
  "troubleshooting": {
    "symptoms": [
      "Landing page loads slowly",
      "Intermittent connection timeouts",
      "Different load times from different locations"
    ],
    "diagnosticQuestions": [
      "What is the DNS lookup time in DevTools Network tab?",
      "Is the domain using a CDN with Anycast?",
      "What is the TTL on the DNS records?",
      "Are there multiple A records (round-robin)?"
    ],
    "causes": [
      {
        "cause": "High TTL on DNS records causing stale cache",
        "probability": "high",
        "resolution": "Lower TTL to 300s for faster propagation while maintaining reasonable cache",
        "verification": "Check DNS TTL with dig command; verify DevTools shows lower lookup time"
      },
      {
        "cause": "No CDN - single origin server",
        "probability": "medium",
        "resolution": "Implement CDN (Cloudflare, Fastly, CloudFront) with Anycast DNS",
        "verification": "Verify CDN is serving content via response headers"
      }
    ]
  },
  "tools": ["Chrome DevTools", "dig/nslookup", "PageSpeed Insights"],
  "children": [...]
}
```

#### Technical Concept Schema (Leaf)
```json
{
  "id": "P4.3.T1",
  "name": "TTL (Time-to-Live)",
  "parentId": "P4.3",
  "priority": "know_well",
  "category": "web_tech",
  "definition": "The duration a DNS record is cached before requiring a fresh lookup.",
  "adsContext": "Low TTL allows faster DNS changes (useful for failover) but increases lookup frequency. High TTL reduces latency but delays propagation.",
  "tscRelevance": "When clients report 'DNS not updating', check TTL value and explain propagation delay.",
  "keyDetails": [
    "Measured in seconds (e.g., 300 = 5 minutes)",
    "Browser, OS, ISP, and recursive resolver all cache independently",
    "Lower TTL for dynamic content, higher for stable content"
  ],
  "interviewQuestions": [
    "What TTL would you recommend for an advertiser's landing page?",
    "Why might a DNS change take hours to propagate even with low TTL?"
  ]
}
```

### Content Coverage Matrix

| Phase | Name | Sub-processes | Est. Concepts | Priority |
|-------|------|---------------|---------------|----------|
| 1 | Account Setup | 4 | ~15 | know_well |
| 2 | Targeting & Bidding | 4 | ~20 | must_know_cold |
| 3 | Ad Auction | 5 | ~18 | must_know_cold |
| 4 | Ad Serving & Click | 11 | ~45 | must_know_cold |
| 5 | Conversion Tracking | 12 | ~50 | must_know_cold |
| 6 | Data Pipelines | 8 | ~35 | must_know_cold |
| 7 | Analysis & Optimization | 5 | ~20 | know_well |
| 8 | AI/ML & Competitive | 5 | ~15 | conceptual_awareness |
| **Total** | | **54** | **~218** | |

### Phase 4 Sub-processes (Highest Interview Weight)
1. SERP Rendering & Ad Display
2. The Ad Click & Redirect Chain (GCLID)
3. DNS Resolution
4. TCP Three-Way Handshake
5. TLS Handshake (HTTPS)
6. HTTP Protocol Deep Dive
7. Cookies in Ad Tracking
8. Browser Rendering Pipeline
9. Core Web Vitals
10. Front-End Performance Optimization
11. Security Fundamentals (CSP, CORS, XSS)

### Phase 5 Sub-processes (High Interview Weight)
1. What Conversion Tracking Is
2. The GCLID Bridge (Click-to-Conversion)
3. Google Tag (gtag.js)
4. Google Tag Manager (GTM)
5. Server-Side GTM (sGTM)
6. Enhanced Conversions
7. Offline Conversion Import (OCI)
8. GA4 ↔ Google Ads Integration
9. Attribution Models
10. Consent Mode v2 & Privacy
11. Conversion Linker & Cross-Domain
12. Conversion Tracking Troubleshooting

### Cross-Cutting Concerns

#### Google Product Ecosystem (10 products)
- Google Ads, GA4, GTM, BigQuery, Looker Studio
- CM360, DV360, Merchant Center, Google Ads API, Search Console

Each product includes:
- Data sent/received flows
- Integration points with phases
- Common TSC issues

#### Competitive Landscape (6 competitors)
- Google, Meta, Amazon, TikTok, Microsoft/Bing, Retail Media Networks

Each competitor includes:
- Core products and strength
- Threat to Google
- Google's response
- 2025-2026 trends

#### Privacy & Consent
- GDPR, CCPA, third-party cookie deprecation
- Consent Mode v2, Privacy Sandbox
- Impact on Phases 2, 4, 5, 6

### Content Sources
- `Prompt_1A_Phases_1-3_Data_Generation.md` - Detailed phase structures
- `Prompt_1B_Phases_4-5_Data_Generation.md` - HTTP/Conversion deep dives
- `Prompt_1C_Phases_6-8_Data_Generation.md` - SQL/BigQuery/AI patterns
- `notebooklm version of info output.txt` (if available) - 800KB master content

---

## Phase 2: React Flow + Tailwind UI

### Goal
Build a polished, interactive workflow visualizer consuming `lifecycle_data.json`.

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | Static export, fast builds |
| Flow Library | React Flow v12+ | Industry standard, Stripe/Typeform use it |
| UI Components | shadcn/ui | Tailwind-native, customizable |
| Styling | Tailwind CSS 4 | Utility-first, consistent design |
| State | Zustand | Simple, performant |
| Icons | Lucide React | Consistent icon set |
| Build Output | Static HTML/JS/CSS | Hostable anywhere |

### Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER (64px fixed)                                                        │
│  Logo | Phase Pills (1-8) | Search | Priority Filter | Category Filter      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CANVAS (React Flow)                                      │ SIDEBAR (360px) │
│  ┌──────────────────────────────────────────────────────┐ │ toggleable      │
│  │                                                      │ │                 │
│  │   [Phase 1] ──────► [Phase 2] ──────► [Phase 3]     │ │ ┌─────────────┐ │
│  │       │                 │                 │          │ │ │ Detail      │ │
│  │       ▼                 ▼                 ▼          │ │ │ Panel       │ │
│  │   [children]       [children]       [children]       │ │ │             │ │
│  │                                                      │ │ │ Tabs:       │ │
│  │                                                      │ │ │ - Overview  │ │
│  │   ┌─────────────────────────────────────────────┐   │ │ │ - Technical │ │
│  │   │ Minimap                                     │   │ │ │ - Trouble   │ │
│  │   └─────────────────────────────────────────────┘   │ │ │ - Tools     │ │
│  │                                                      │ │ │ - Interview │ │
│  └──────────────────────────────────────────────────────┘ │ └─────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Custom Node Types

#### 1. PhaseNode
```tsx
// Large card (200x120px)
// - Colored header bar based on category
// - Title, phase number badge
// - Priority indicator (border thickness + glow)
// - Child count badge
// - Expand/collapse chevron
```

#### 2. SubProcessNode
```tsx
// Medium card (160x80px)
// - Category color tag
// - Title
// - Priority border
// - Child count if has children
```

#### 3. ConceptNode
```tsx
// Small card (140x60px)
// - Definition preview (truncated)
// - Category dot
// - Priority border
```

### Priority Visual System

| Priority | Border | Background | Glow |
|----------|--------|------------|------|
| `must_know_cold` | 3px red (#ea4335) | red-50 gradient | red shadow |
| `know_well` | 2px amber (#fbbc04) | amber-50 gradient | amber shadow |
| `conceptual_awareness` | 1px blue (#4285f4) | blue-50 gradient | none |

### Category Color Tags

| Category | Color | Hex |
|----------|-------|-----|
| web_tech | Blue | #1967d2 |
| databases_sql | Purple | #8430ce |
| big_data | Orange | #ea8600 |
| ai_ml | Green | #137333 |
| digital_marketing | Red | #c5221f |
| security | Gray | #5f6368 |
| data_pipelines | Teal | #00695c |

### Edge Styling

- **Phase-to-Phase:** Thick (3px), dark gray, animated dash on hover
- **Parent-to-Child:** Medium (2px), lighter gray, bezier curves
- **Cross-connections:** Dashed, curved, labeled

React Flow's automatic edge routing prevents the "smashed together" arrow problem.

### Interactions

| Action | Behavior |
|--------|----------|
| Click node | Select → open detail panel |
| Double-click | Expand/collapse children inline |
| Drag node | Reposition (canvas saves state) |
| Pan canvas | Click + drag background |
| Zoom | Scroll wheel / pinch |
| Minimap click | Jump to location |
| Filter toggle | Non-matching nodes dim to 20% |
| Search | Real-time highlight matches |

### Detail Panel Tabs

1. **Overview**
   - Definition
   - Ads Context (highlighted)
   - TSC Relevance (highlighted)
   - Key Details list

2. **Technical**
   - Deep dive content
   - Code blocks for SQL/HTTP examples
   - Diagrams where applicable

3. **Troubleshooting**
   - Symptoms (what client reports)
   - Diagnostic Questions (decision tree)
   - Likely Causes with probability badges
   - Resolution steps
   - Verification steps

4. **Tools**
   - Related Google tools
   - Integration points
   - Links to documentation

5. **Interview**
   - Common interview questions
   - Expected answer points
   - SQL connection if applicable

### Filtering System

```tsx
// FilterBar component
<FilterBar>
  <PriorityFilter
    options={["all", "critical", "important", "awareness"]}
    onChange={setPriorityFilter}
  />
  <CategoryFilter
    options={categories}
    onChange={setCategoryFilter}
  />
  <SearchInput
    placeholder="Search concepts..."
    onChange={setSearchQuery}
  />
</FilterBar>
```

Non-matching nodes render with `opacity: 0.2` and `pointer-events: none`.

### Sidebar Panels

1. **Google Ecosystem** - Visual map of 10 Google products with data flow arrows
2. **Competitors** - Comparison cards for 6 competitors
3. **Privacy** - Consent Mode v2, GDPR, cookie deprecation impacts

### Performance Optimizations

- Lazy render collapsed subtrees
- Virtualize large node lists
- Debounce filter/search (200ms)
- Memoize node components
- Use React Flow's built-in viewport culling

### File Structure

```
google-ads-lifecycle-tool/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── flow/
│   │   ├── PhaseNode.tsx
│   │   ├── SubProcessNode.tsx
│   │   ├── ConceptNode.tsx
│   │   └── CustomEdge.tsx
│   ├── panels/
│   │   ├── DetailPanel.tsx
│   │   ├── EcosystemPanel.tsx
│   │   └── CompetitorPanel.tsx
│   ├── filters/
│   │   ├── FilterBar.tsx
│   │   ├── PriorityFilter.tsx
│   │   └── SearchInput.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── store.ts (Zustand)
│   └── utils.ts
├── data/
│   └── lifecycle_data.json
├── tailwind.config.ts
└── package.json
```

---

## Success Criteria

### Phase 1 (Content)
- [ ] All 8 phases have complete sub-process trees
- [ ] 54+ sub-processes with full schema
- [ ] 200+ technical concepts with ads_context
- [ ] All troubleshooting trees have symptoms → causes → resolutions
- [ ] Interview questions for critical concepts
- [ ] SQL examples for Phase 6 concepts
- [ ] Cross-cutting concerns populated

### Phase 2 (UI)
- [ ] React Flow renders all phases with auto-layout
- [ ] Custom nodes display priority colors correctly
- [ ] Edges render smoothly (no overlap/smash)
- [ ] Drag/pan/zoom work smoothly
- [ ] Detail panel shows all content tabs
- [ ] Filtering dims non-matching nodes
- [ ] Search highlights matches
- [ ] Sidebar panels functional
- [ ] Static export works (opens in browser)
- [ ] Mobile-responsive (basic support)

---

## Timeline

| Phase | Tasks | Priority |
|-------|-------|----------|
| **Phase 1** | Generate lifecycle_data.json | HIGH - Content is foundation |
| **Phase 2.1** | Scaffold Next.js + React Flow | After Phase 1 |
| **Phase 2.2** | Build custom nodes | After scaffold |
| **Phase 2.3** | Implement detail panel | After nodes |
| **Phase 2.4** | Add filtering/search | After panel |
| **Phase 2.5** | Build sidebar panels | After filtering |
| **Phase 2.6** | Polish & export | Final |

---

## References

- [React Flow Documentation](https://reactflow.dev)
- [React Flow UI Components](https://reactflow.dev/ui)
- [React Flow + Tailwind Example](https://reactflow.dev/examples/styling/tailwind)
- [shadcn/ui](https://ui.shadcn.com)
- [Workflow Editor Template](https://reactflow.dev/ui/templates/workflow-editor)

---

*Design approved: 2026-02-15*
