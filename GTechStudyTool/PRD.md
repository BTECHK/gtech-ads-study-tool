# Google Ads Lifecycle Study Tool - Product Requirements Document

**Version:** 1.0
**Author:** Kyle Atekwana
**Date:** February 2026
**Status:** Shipped (v1.0)

---

## 1. Overview

### 1.1 Problem Statement

Understanding the complete Google Ads lifecycle - from account setup through optimization and troubleshooting - requires seeing how all the pieces fit together. Traditional study methods (documents, flashcards) fail to show how concepts connect and flow into each other, making it difficult to build a comprehensive mental model of the platform.

**Evidence:**
> "I kept forgetting how targeting settings cascade down from campaign to ad group level because I was studying each concept in isolation."

### 1.2 Opportunity

Learning complex systems is shifting toward visual and interactive approaches. A tool that maps the entire Google Ads ecosystem as an explorable workflow allows learners to:
- See relationships between concepts at a glance
- Drill down into specifics on demand
- Filter by priority level to focus study time
- Build a connected understanding of the platform

### 1.3 Solution Summary

An interactive visual learning tool built with React Flow that displays the Google Ads lifecycle as a navigable node graph. Users can expand/collapse phases, filter by priority, search for specific topics, and view detailed information including definitions, key concepts, troubleshooting guides, and SQL connections.

### 1.4 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Primary: Learning confidence | User reports feeling knowledgeable | Self-assessment |
| Secondary: Topic coverage | 100% of key Google Ads topics covered | Content audit |
| Guardrail: Usability | Tool is intuitive without training | User testing |

---

## 2. Target Users

### 2.1 Primary User Persona

**Name:** Google Ads Learner
**Segment:** Technical professionals learning Google Ads

**Demographics:**
- Technical background (engineering, IT, analytics)
- Familiar with digital advertising concepts
- Looking to deepen understanding of Google Ads

**Jobs to be Done:**

| Job Type | Job Statement | Priority |
|----------|---------------|----------|
| Functional | Understand the complete Google Ads lifecycle end-to-end | P0 |
| Functional | Know which topics are most critical ("must know cold") | P0 |
| Emotional | Feel confident and knowledgeable about the platform | P0 |
| Functional | Explore common scenarios and solutions | P1 |

**Pain Points:**
1. Overwhelming amount of Google Ads documentation to review
2. Difficulty understanding how concepts relate to each other
3. Unclear which topics are most important to focus on

**Current Alternatives:**
- Google Ads documentation - Comprehensive but overwhelming, no prioritization
- Generic study guides - Miss technical depth
- Flashcards - Isolated facts without showing relationships

### 2.2 Anti-Personas (Who This Is NOT For)

- Complete beginners to digital advertising - Requires baseline knowledge
- Users seeking Google Ads certification (different scope)
- Non-technical roles (marketing managers without technical focus)

---

## 3. User Stories & Requirements

### 3.1 Epic Overview

| Epic | Description | Priority | JTBD Mapping |
|------|-------------|----------|--------------|
| Epic 1 | Visual Lifecycle Navigation | P0 | Understand lifecycle end-to-end |
| Epic 2 | Priority-Based Filtering | P0 | Know which topics are critical |
| Epic 3 | Detailed Information Display | P0 | Deep-dive into specific concepts |
| Epic 4 | Search & Discovery | P1 | Find specific topics quickly |

### 3.2 Detailed User Stories

**Epic 1: Visual Lifecycle Navigation**

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US-001 | As a user, I want to see all phases of the Google Ads lifecycle so I understand the full scope | - All 8 phases displayed as nodes<br>- Phases connected with edges showing flow | P0 |
| US-002 | As a user, I want to expand a phase to see its sub-topics so I can drill into details | - Clicking expand chevron reveals children<br>- Children appear below parent with connecting edges | P0 |
| US-003 | As a user, I want to select a node to highlight it so I can track my focus | - Selected node shows visual ring indicator<br>- Selection persists until another node clicked | P0 |

**Epic 2: Priority-Based Filtering**

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US-004 | As a user, I want to filter by priority level so I can focus on critical topics | - Filter dropdown with priority options<br>- Non-matching nodes visually dimmed | P0 |
| US-005 | As a user, I want visual priority indicators so I can see importance at a glance | - "Must know cold" = red border<br>- "Know well" = amber border<br>- "Conceptual" = blue border | P0 |

**Epic 3: Detailed Information Display**

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US-006 | As a user, I want to view detailed info about a topic so I can study deeply | - Info button opens sidebar panel<br>- Shows definition, context, key details | P0 |
| US-007 | As a user, I want to see key questions so I can test my understanding | - Key questions listed in detail panel<br>- Practical scenarios included | P0 |
| US-008 | As a user, I want to see troubleshooting info so I can learn diagnostic approaches | - Symptoms, causes, resolutions shown<br>- Probability indicators for common issues | P1 |

**Epic 4: Search & Discovery**

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US-009 | As a user, I want to search for topics so I can find specific concepts quickly | - Search input in header<br>- Results filter visible nodes | P1 |

---

## 4. Functional Requirements

### 4.1 Core Functionality

**Visual Canvas**

| Requirement ID | Requirement | Priority |
|----------------|-------------|----------|
| FR-001 | Display phases as interactive nodes using React Flow | P0 |
| FR-002 | Connect nodes with edges showing data/process flow | P0 |
| FR-003 | Support pan, zoom, and minimap navigation | P0 |
| FR-004 | Fit view to show all content on load | P0 |

**Node Interaction**

| Requirement ID | Requirement | Priority |
|----------------|-------------|----------|
| FR-005 | Single-click selects and highlights node | P0 |
| FR-006 | Info button opens sidebar with details | P0 |
| FR-007 | Chevron button expands/collapses children | P0 |
| FR-008 | Nodes display category badge and item count | P0 |

**Sidebar Panel**

| Requirement ID | Requirement | Priority |
|----------------|-------------|----------|
| FR-009 | Display full topic information in scrollable panel | P0 |
| FR-010 | Tab navigation for Detail, Ecosystem, Competitors, Privacy | P0 |
| FR-011 | Close button to dismiss sidebar | P0 |

### 4.2 User Flows

**Flow 1: Study a Topic**
```
Step 1: User views lifecycle canvas
   → User sees: All 8 phases as nodes
   → System: Renders React Flow canvas with data

Step 2: User clicks expand chevron on Phase
   → User sees: Child topics appear below
   → System: Updates expanded state, re-renders layout

Step 3: User clicks Info button on topic
   → User sees: Sidebar opens with full details
   → System: Sets selected node, opens sidebar

Step 4: User reads definition, key concepts
   → User sees: Scrollable content in sidebar
   → System: Displays topic data from JSON

Success State: User understands topic and relationships
```

**Flow 2: Focus on High-Priority Topics**
```
Step 1: User selects "Must Know Cold" from priority filter
   → User sees: Only critical topics highlighted
   → System: Dims non-matching nodes

Step 2: User studies highlighted topics
   → User sees: Focused view of critical content
   → System: Maintains filter state

Success State: User efficiently studies most important topics
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Initial page load | < 3 seconds | Lighthouse |
| Node expand/collapse | < 100ms | User perception |
| Filter application | < 200ms | User perception |

### 5.2 Accessibility

- Keyboard navigation for all interactive elements
- Sufficient color contrast for priority indicators
- Screen reader compatible labels

### 5.3 Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Desktop-optimized (1280px+ viewport)

---

## 6. Technical Architecture

### 6.1 Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 |
| UI Library | React 18 |
| Flow Visualization | React Flow |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Language | TypeScript |

### 6.2 Data Structure

- Lifecycle data stored in `lifecycle_data.json`
- Hierarchical structure: Phases → Children → Grandchildren
- Each node contains: id, name, priority, category, definition, adsContext, keyDetails, keyQuestions, troubleshooting

---

## 7. UX/UI Requirements

### 7.1 Design Principles

1. **Visual Hierarchy** - Priority levels instantly visible through color coding
2. **Progressive Disclosure** - Start with phases, expand to details on demand
3. **Focus Support** - Selection highlighting helps track current study topic

### 7.2 Key Screens

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Main Canvas | Lifecycle visualization | Phase nodes, connecting edges, minimap |
| Header | Navigation & filtering | Search, priority filter, expand/collapse all |
| Sidebar | Topic details | Tabbed content panels, close button |

### 7.3 Visual Language

- **Must Know Cold**: Red border (3px), red gradient background
- **Know Well**: Amber border (2px), amber gradient background
- **Conceptual Awareness**: Blue border (1px), blue gradient background
- **Selected State**: Blue ring with shadow, elevated appearance

---

## 8. Content Requirements

### 8.1 Coverage

8 phases covering the complete Google Ads lifecycle:
1. Account Setup
2. Targeting Setup
3. Ad Creation
4. Bidding & Budget
5. Tracking Setup
6. Performance Analysis
7. Optimization
8. Troubleshooting

### 8.2 Per-Topic Content

Each topic includes:
- Definition
- Google Ads context
- Practical relevance
- Key details (bullet points)
- Key questions for understanding
- SQL connection (where applicable)
- Troubleshooting guide (symptoms, causes, resolutions)

---

## 9. Success Criteria

### 9.1 Launch Criteria

- [x] All 8 phases implemented with children
- [x] Priority filtering functional
- [x] Search functional
- [x] Sidebar with full details
- [x] Responsive to 1280px+ viewports
- [x] No critical bugs

### 9.2 Quality Standards

- TypeScript strict mode enabled
- No console errors in production
- All interactive elements have hover states
- Smooth animations on expand/collapse

---

## 10. Timeline

| Phase | Milestone | Status |
|-------|-----------|--------|
| Phase 1 | Core canvas with phases | Complete |
| Phase 2 | Expand/collapse, filtering | Complete |
| Phase 3 | Sidebar with full details | Complete |
| Phase 4 | UX polish, info buttons | Complete |
| Phase 5 | Testing & deployment | Complete |

---

## 11. Open Source

This project is released under the **PolyForm Noncommercial License 1.0.0**.

- Free for personal study, research, and educational use
- Commercial use requires permission from the author

---

## 12. Appendices

### 12.1 Repository

GitHub: [BTECHK/gtech-ads-study-tool](https://github.com/BTECHK/gtech-ads-study-tool)

### 12.2 Related Resources

- [Google Ads Help Center](https://support.google.com/google-ads)
- [React Flow Documentation](https://reactflow.dev/)
