# Google Ads Lifecycle Tool - React Flow Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Google Ads Lifecycle study tool with comprehensive content and React Flow UI.

**Architecture:** Two-phase approach - generate `lifecycle_data.json` with 54 sub-processes and 218+ concepts, then build React Flow + Tailwind app consuming that JSON. Content-first ensures highest-priority interview material is complete before UI work.

**Tech Stack:** Next.js 14, React Flow v12, Tailwind CSS 4, shadcn/ui, Zustand, TypeScript

---

## Phase 1: Content Generation

### Task 1: Create JSON Schema and Phase 1-3 Content

**Files:**
- Create: `data/lifecycle_data.json`
- Reference: `Prompt_1A_Phases_1-3_Data_Generation.md`

**Step 1: Create data directory and base JSON structure**

Create `data/lifecycle_data.json`:

```json
{
  "meta": {
    "title": "Google Ads Lifecycle",
    "version": "2.0",
    "lastUpdated": "2026-02-15",
    "interviewDate": "2026-02-19"
  },
  "phases": [],
  "crossCutting": {
    "googleEcosystem": [],
    "competitors": [],
    "privacyConsent": []
  }
}
```

**Step 2: Add Phase 1 - Account Setup (4 sub-processes)**

Add to `phases` array:

```json
{
  "id": "phase-1",
  "name": "Account Setup",
  "phaseNumber": 1,
  "priority": "know_well",
  "category": "digital_marketing",
  "funnelStage": "Awareness → Loyalty",
  "summary": "Creating and structuring Google Ads accounts with proper hierarchy, campaign types, and pricing models",
  "adsContext": "Account structure determines reporting granularity, budget allocation flexibility, and optimization capabilities. Poor structure = limited control.",
  "dataFlowIn": "Business goals, budget, target audience",
  "dataFlowOut": "Configured account ready for targeting setup",
  "children": [
    {
      "id": "P1.1",
      "name": "Account Hierarchy",
      "parentId": "phase-1",
      "priority": "know_well",
      "category": "digital_marketing",
      "definition": "The three-level organizational structure: Account → Campaign → Ad Group, each with distinct settings and controls.",
      "adsContext": "Understanding hierarchy is essential for TSC troubleshooting - budget issues are campaign-level, keyword issues are ad group-level, billing issues are account-level.",
      "tscRelevance": "When clients report 'ads not showing', first identify WHICH level has the issue: account (billing/suspension), campaign (budget/schedule), or ad group (keywords/bids).",
      "keyDetails": [
        "Account: CID (10-digit), billing, timezone, user access, MCC linkage",
        "Campaign: Budget (daily/shared), network, location targeting, bidding strategy, schedule",
        "Ad Group: Keywords, audiences, ads, ad group bids, negative keywords"
      ],
      "interviewQuestions": [
        "Where does budget get set in Google Ads?",
        "What's the difference between account-level and campaign-level settings?",
        "How would you structure an account for a client with 3 product lines?"
      ],
      "sqlConnection": "SELECT account_id, campaign_id, ad_group_id FROM ads_data - hierarchy enables JOIN patterns",
      "troubleshooting": {
        "symptoms": ["Can't find where to change budget", "Ads not spending evenly across campaigns"],
        "diagnosticQuestions": [
          "Are you looking at campaign or ad group level?",
          "Is there a shared budget applied?",
          "What's the daily budget vs actual spend?"
        ],
        "causes": [
          {
            "cause": "Client editing ad group when issue is at campaign level",
            "probability": "high",
            "resolution": "Navigate to campaign settings to adjust budget/schedule",
            "verification": "Confirm budget appears in campaign settings panel"
          }
        ]
      },
      "tools": ["Google Ads UI", "Google Ads Editor"],
      "children": [
        {
          "id": "P1.1.T1",
          "name": "Account (CID)",
          "parentId": "P1.1",
          "priority": "know_well",
          "category": "digital_marketing",
          "definition": "The top-level container identified by a 10-digit Customer ID (CID), containing billing, timezone, and user permissions.",
          "adsContext": "The CID is used in API calls, support tickets, and BigQuery exports. Multiple accounts can be linked under an MCC.",
          "tscRelevance": "Always ask for CID when troubleshooting - it's the unique identifier across all Google systems.",
          "keyDetails": [
            "Format: XXX-XXX-XXXX (10 digits with dashes)",
            "Contains: billing info, timezone, currency, user access",
            "MCC (My Client Center) manages multiple CIDs"
          ],
          "interviewQuestions": ["What information is stored at the account level?"]
        },
        {
          "id": "P1.1.T2",
          "name": "Campaign Level",
          "parentId": "P1.1",
          "priority": "know_well",
          "category": "digital_marketing",
          "definition": "The second-level container where budget, bidding strategy, network targeting, and schedule are configured.",
          "adsContext": "Campaign is where spending control lives. Budget exhaustion, scheduling issues, and network selection problems are all campaign-level.",
          "tscRelevance": "Most 'ads not showing' issues trace to campaign settings: budget depleted, schedule paused, or wrong network selected.",
          "keyDetails": [
            "Budget: Daily budget or shared budget pool",
            "Bidding: Manual CPC, Target CPA, Max Conversions, etc.",
            "Networks: Search, Display, Search Partners",
            "Schedule: Day/time ad delivery windows"
          ],
          "interviewQuestions": ["What settings are controlled at campaign level vs ad group level?"]
        },
        {
          "id": "P1.1.T3",
          "name": "Ad Group Level",
          "parentId": "P1.1",
          "priority": "know_well",
          "category": "digital_marketing",
          "definition": "The third-level container grouping related keywords, audiences, and ads with shared bids.",
          "adsContext": "Ad groups should be tightly themed - one topic per ad group ensures ad relevance to keywords, improving Quality Score.",
          "tscRelevance": "Low Quality Score often traces to ad groups mixing unrelated keywords, causing poor ad-to-keyword relevance.",
          "keyDetails": [
            "Contains: keywords, negative keywords, audiences, ads",
            "Bids: Default bid for all keywords (can be overridden per keyword)",
            "Best practice: 10-20 keywords per ad group, single theme"
          ],
          "interviewQuestions": ["How many keywords should be in an ad group and why?"]
        }
      ]
    },
    {
      "id": "P1.2",
      "name": "Campaign Types",
      "parentId": "phase-1",
      "priority": "know_well",
      "category": "digital_marketing",
      "definition": "The different campaign formats available in Google Ads, each designed for specific marketing objectives and inventory.",
      "adsContext": "Campaign type determines available targeting options, ad formats, and where ads appear. Wrong campaign type = wrong audience.",
      "tscRelevance": "Clients often choose wrong campaign type for their goal (e.g., Display for direct response). Guide them to appropriate type.",
      "keyDetails": [
        "Search: Text ads on Google Search results (intent-based)",
        "Display: Image/responsive ads across Google Display Network (awareness)",
        "Video: YouTube ads (awareness, consideration)",
        "Shopping: Product listing ads (e-commerce)",
        "App: Installs and engagement across all Google properties",
        "Performance Max: AI-driven across all Google inventory",
        "Demand Gen: Discovery + YouTube Shorts + Gmail (social-like)"
      ],
      "interviewQuestions": [
        "When would you recommend Search vs Display?",
        "What's the difference between Performance Max and Smart Shopping?",
        "Which campaign type has the highest purchase intent?"
      ],
      "sqlConnection": "campaign.advertising_channel_type in BigQuery exports",
      "troubleshooting": {
        "symptoms": ["Low conversion rate despite high clicks", "Ads showing to wrong audience"],
        "diagnosticQuestions": [
          "What's the client's primary goal (awareness vs conversions)?",
          "Which campaign type are they using?",
          "Where are the ads actually appearing?"
        ],
        "causes": [
          {
            "cause": "Using Display campaign for direct response goal",
            "probability": "high",
            "resolution": "Switch to Search campaign for high-intent users",
            "verification": "Conversion rate improves after campaign type change"
          }
        ]
      },
      "tools": ["Google Ads UI"],
      "children": [
        {
          "id": "P1.2.T1",
          "name": "Search Campaigns",
          "parentId": "P1.2",
          "priority": "must_know_cold",
          "category": "digital_marketing",
          "definition": "Text-based ads appearing on Google Search results pages, triggered by user search queries.",
          "adsContext": "Highest intent traffic - users are actively searching. Best for direct response, lead gen, e-commerce.",
          "tscRelevance": "Search is the bread-and-butter of Google Ads. Most TSC cases involve Search campaign optimization.",
          "keyDetails": [
            "Triggers: Keywords (exact, phrase, broad match)",
            "Ad format: Headlines, descriptions, display URL, extensions",
            "Appears: Google Search, Search Partners (optional)",
            "Bidding: All strategies available"
          ],
          "interviewQuestions": ["Why does Search typically have higher conversion rates than Display?"]
        },
        {
          "id": "P1.2.T2",
          "name": "Display Campaigns",
          "parentId": "P1.2",
          "priority": "know_well",
          "category": "digital_marketing",
          "definition": "Image and responsive ads appearing across the Google Display Network (GDN) - 35M+ websites, apps, and Google properties.",
          "adsContext": "Lower intent but massive reach. Good for awareness, remarketing, and brand building.",
          "tscRelevance": "Display often has placement quality issues - ads appearing on irrelevant sites. Check placement reports.",
          "keyDetails": [
            "Reach: 90% of internet users globally",
            "Targeting: Audiences, topics, placements, keywords (contextual)",
            "Ad formats: Responsive display ads, uploaded images, HTML5",
            "Common issue: Brand safety (ads on inappropriate sites)"
          ],
          "interviewQuestions": ["How would you prevent Display ads from showing on inappropriate websites?"]
        },
        {
          "id": "P1.2.T3",
          "name": "Performance Max",
          "parentId": "P1.2",
          "priority": "know_well",
          "category": "ai_ml",
          "definition": "AI-driven campaign type that automatically runs ads across all Google inventory (Search, Display, YouTube, Discover, Gmail, Maps) using a single campaign.",
          "adsContext": "Google's push toward automation. Provides less control but leverages ML across all channels. Replaced Smart Shopping.",
          "tscRelevance": "Clients complain about lack of visibility/control. Explain asset groups, audience signals, and insights reporting.",
          "keyDetails": [
            "Inventory: All Google properties in one campaign",
            "Inputs: Asset groups (images, videos, headlines, descriptions), audience signals",
            "Control: Limited - Google's ML decides placement and bidding",
            "Reporting: Insights tab shows top-performing assets and audiences"
          ],
          "interviewQuestions": [
            "What are the trade-offs of Performance Max vs manual campaigns?",
            "How do audience signals work in PMax?"
          ]
        }
      ]
    },
    {
      "id": "P1.3",
      "name": "Full-Funnel Campaign Strategy",
      "parentId": "phase-1",
      "priority": "know_well",
      "category": "digital_marketing",
      "definition": "Aligning campaign types and targeting to the marketing funnel stages: Awareness → Consideration → Intent → Action → Loyalty.",
      "adsContext": "Different funnel stages require different campaign types, messaging, and success metrics. Don't measure awareness campaigns by conversions.",
      "tscRelevance": "Clients often measure wrong KPIs for funnel stage. Awareness = reach/frequency, Action = conversions/ROAS.",
      "keyDetails": [
        "Awareness: Display, Video (YouTube), Demand Gen - measure reach, impressions",
        "Consideration: Video, Display remarketing - measure engagement, video views",
        "Intent: Search, Shopping - measure clicks, CTR",
        "Action: Search, Shopping, PMax - measure conversions, CPA, ROAS",
        "Loyalty: Customer Match, remarketing - measure repeat purchases, LTV"
      ],
      "interviewQuestions": [
        "How would you structure campaigns for a new product launch?",
        "Which metrics matter at each funnel stage?"
      ],
      "sqlConnection": null,
      "troubleshooting": {
        "symptoms": ["Awareness campaign has poor ROAS", "Search campaign not scaling"],
        "diagnosticQuestions": [
          "What funnel stage is this campaign targeting?",
          "Are the KPIs aligned to the funnel stage?",
          "Is there upper-funnel activity feeding the Search campaign?"
        ],
        "causes": [
          {
            "cause": "Measuring awareness campaign by ROAS instead of reach",
            "probability": "high",
            "resolution": "Set appropriate KPIs: reach, frequency, brand lift for awareness",
            "verification": "Client understands funnel-appropriate metrics"
          }
        ]
      },
      "tools": ["Google Ads UI", "Reach Planner"],
      "children": []
    },
    {
      "id": "P1.4",
      "name": "Pricing Models",
      "parentId": "phase-1",
      "priority": "know_well",
      "category": "digital_marketing",
      "definition": "The different ways advertisers are charged in Google Ads: per click, per thousand impressions, per view, or per conversion.",
      "adsContext": "Pricing model should align with campaign goal. CPC for direct response, CPM for awareness, CPA for conversion-focused bidding.",
      "tscRelevance": "Clients confused about billing often don't understand their pricing model. Explain when each applies.",
      "keyDetails": [
        "CPC (Cost Per Click): Pay when user clicks. Default for Search.",
        "CPM (Cost Per Mille/Thousand): Pay per 1,000 impressions. Display awareness.",
        "CPV (Cost Per View): Pay when user watches 30s or engages. Video campaigns.",
        "CPA (Cost Per Action): Pay per conversion. Requires conversion tracking.",
        "ROAS (Return on Ad Spend): Target revenue/ad spend ratio. Requires conversion values."
      ],
      "interviewQuestions": [
        "When would you use CPM vs CPC bidding?",
        "What's required before using Target CPA bidding?"
      ],
      "sqlConnection": "metrics.cost_micros, metrics.clicks, metrics.impressions - calculate actual CPC/CPM",
      "troubleshooting": {
        "symptoms": ["Higher costs than expected", "CPA much higher than target"],
        "diagnosticQuestions": [
          "What bidding strategy is the campaign using?",
          "Is conversion tracking properly implemented?",
          "How long has the campaign been in learning period?"
        ],
        "causes": [
          {
            "cause": "Target CPA set without enough conversion data",
            "probability": "high",
            "resolution": "Need 30+ conversions/month for Target CPA. Use Max Conversions first.",
            "verification": "Check conversion volume and learning period status"
          }
        ]
      },
      "tools": ["Google Ads UI", "Bid Simulator"],
      "children": []
    }
  ]
}
```

**Step 3: Validate JSON syntax**

Run: `cat data/lifecycle_data.json | python -m json.tool > /dev/null && echo "Valid JSON"`

Expected: `Valid JSON`

**Step 4: Commit Phase 1 content**

```bash
git add data/lifecycle_data.json
git commit -m "feat: add Phase 1 (Account Setup) content with 4 sub-processes"
```

---

### Task 2: Add Phase 2 - Targeting & Bidding Content

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1A_Phases_1-3_Data_Generation.md`

**Step 1: Add Phase 2 to phases array**

Add after Phase 1 in the `phases` array (full content with 4 sub-processes: Keyword Targeting, Audience Targeting, Bidding Strategies, Budget Configuration). Include:
- Match types (exact, phrase, broad) with ML evolution context
- Audience types (in-market, affinity, Customer Match, remarketing)
- Smart Bidding signals and learning period
- Budget pacing and shared budgets

**Step 2: Validate JSON**

Run: `cat data/lifecycle_data.json | python -m json.tool > /dev/null && echo "Valid JSON"`

**Step 3: Commit**

```bash
git add data/lifecycle_data.json
git commit -m "feat: add Phase 2 (Targeting & Bidding) content"
```

---

### Task 3: Add Phase 3 - Ad Auction Content

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1A_Phases_1-3_Data_Generation.md`

**Step 1: Add Phase 3 with 5 sub-processes**

Include:
- Auction Mechanics (real-time, <100ms, billions/day)
- Ad Rank Calculation (Bid × QS × Extensions)
- Quality Score Deep Dive (Expected CTR, Ad Relevance, Landing Page)
- Ad Creative & Extensions (RSAs, extensions)
- Ad Disapprovals & Policy

This is `must_know_cold` - include detailed troubleshooting trees.

**Step 2: Validate and commit**

```bash
git commit -m "feat: add Phase 3 (Ad Auction) content - must_know_cold"
```

---

### Task 4: Add Phase 4 - Ad Serving & Click Content (CRITICAL)

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1B_Phases_4-5_Data_Generation.md`

**Step 1: Add Phase 4 with 11 sub-processes**

This is the highest interview weight. Include all:

1. **SERP Rendering** - How ads appear on search results
2. **Ad Click & Redirect Chain** - GCLID appending, 302 redirect, parallel tracking
3. **DNS Resolution** - Recursive queries, TTL, Anycast, CDN
4. **TCP Handshake** - SYN/SYN-ACK/ACK, RTT, connection reuse
5. **TLS Handshake** - HTTPS, TLS 1.2 vs 1.3, certificate validation
6. **HTTP Protocol** - Methods (GET/POST), status codes (200/301/302/404/500), headers
7. **Cookies in Ad Tracking** - First-party vs third-party, SameSite, ITP
8. **Browser Rendering** - DOM, CSSOM, render tree, layout, paint
9. **Core Web Vitals** - LCP (<2.5s), INP (<200ms), CLS (<0.1)
10. **Front-End Performance** - Minification, compression, CDN, preload
11. **Security Fundamentals** - CSP, CORS, XSS, CSRF

Each must have:
- `adsContext` explaining why it matters for Google Ads
- `tscRelevance` for troubleshooting scenarios
- Detailed `troubleshooting` decision trees
- `interviewQuestions` likely to be asked

**Step 2: Validate and commit**

```bash
git commit -m "feat: add Phase 4 (Ad Serving & Click) - 11 sub-processes, highest interview weight"
```

---

### Task 5: Add Phase 5 - Conversion Tracking Content (CRITICAL)

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1B_Phases_4-5_Data_Generation.md`

**Step 1: Add Phase 5 with 12 sub-processes**

Include all:

1. **What Conversion Tracking Is** - Definition, why it's non-negotiable
2. **GCLID Bridge** - Click → cookie → tag → attribution flow
3. **Google Tag (gtag.js)** - gtag('config'), gtag('event'), async
4. **GTM Architecture** - Container, Tags, Triggers, Variables, dataLayer
5. **Server-Side GTM** - Cloud Run, first-party collection, privacy
6. **Enhanced Conversions** - Hashed PII (SHA-256), privacy-preserving matching
7. **Offline Conversion Import** - GCLID capture in CRM, upload flow
8. **GA4 ↔ Google Ads Integration** - Audiences, conversion events, discrepancies
9. **Attribution Models** - Last-click, data-driven (DDA), cross-device
10. **Consent Mode v2** - Consent signals, cookieless measurement, modeling
11. **Conversion Linker** - Cross-domain tracking, GCLID persistence
12. **Troubleshooting Framework** - 5-step diagnostic decision tree

**Step 2: Validate and commit**

```bash
git commit -m "feat: add Phase 5 (Conversion Tracking) - 12 sub-processes, TSC core skill"
```

---

### Task 6: Add Phase 6 - Data Pipelines Content (SQL Focus)

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1C_Phases_6-8_Data_Generation.md`

**Step 1: Add Phase 6 with 8 sub-processes**

Include:

1. **End-to-End Data Flow** - Browser → Google → Ads UI → BigQuery → Dashboards
2. **Relational Database Concepts** - Tables, keys, normalization, indexing, ACID
3. **Non-Relational Databases** - Document, key-value, wide-column, graph
4. **CAP Theorem** - Consistency, Availability, Partition tolerance
5. **BigQuery Deep Dive** - Columnar storage, partitioning, clustering, cost model
6. **SQL Patterns for Ads** - Window functions, CTEs, funnel analysis, anomaly detection
7. **ETL vs ELT** - Transform timing, BigQuery as ELT
8. **Batch vs Stream** - Daily reporting vs real-time bidding

Include actual SQL examples in `sqlConnection` fields:

```sql
-- Campaign performance with window function
SELECT
  campaign_name,
  date,
  conversions,
  LAG(conversions, 7) OVER (PARTITION BY campaign_id ORDER BY date) as conversions_7d_ago,
  SAFE_DIVIDE(conversions - LAG(conversions, 7) OVER (...), LAG(conversions, 7) OVER (...)) as wow_change
FROM campaign_performance
```

**Step 2: Validate and commit**

```bash
git commit -m "feat: add Phase 6 (Data Pipelines) - SQL patterns, BigQuery optimization"
```

---

### Task 7: Add Phases 7-8 and Cross-Cutting Concerns

**Files:**
- Modify: `data/lifecycle_data.json`
- Reference: `Prompt_1C_Phases_6-8_Data_Generation.md`

**Step 1: Add Phase 7 - Analysis & Optimization (5 sub-processes)**

- Optimization Framework
- Metric Diagnostic Chain
- Search Term Analysis
- Landing Page Optimization
- Reporting & Dashboards

**Step 2: Add Phase 8 - AI/ML & Competitive (5 sub-processes)**

- Smart Bidding ML Internals
- Performance Max
- Broad Match Evolution
- Generative AI in Ads
- Competitive Landscape

**Step 3: Add Cross-Cutting Concerns**

Add to `crossCutting` object:

```json
"googleEcosystem": [
  {
    "product": "Google Ads",
    "description": "Self-serve advertising platform",
    "phasesInvolved": ["P1", "P2", "P3", "P4", "P5", "P7", "P8"],
    "dataSent": "Campaign configs, bids, creatives",
    "dataReceived": "Conversions (via tags), audiences (GA4), products (Merchant Center)",
    "commonTscIssues": ["Budget not spending", "Conversions not tracking", "Ads disapproved", "Quality Score issues"]
  },
  // ... 9 more products (GA4, GTM, BigQuery, etc.)
],
"competitors": [
  {
    "name": "Meta (Facebook/Instagram)",
    "coreProducts": "Facebook Ads, Instagram Ads, Audience Network",
    "coreStrength": "Social engagement data, demographic targeting, Advantage+ automation",
    "threatToGoogle": "Demand creation before search intent forms",
    "googleResponse": "Demand Gen campaigns, YouTube Shorts ads"
  },
  // ... 5 more competitors
],
"privacyConsent": [
  {
    "concept": "Consent Mode v2",
    "definition": "Google's API for passing user consent signals to adjust tag behavior",
    "adsContext": "Required in EU/EEA for Google Ads. Enables conversion modeling when consent denied.",
    "affectedPhases": ["P4", "P5", "P6"]
  },
  // ... GDPR, CCPA, third-party cookie deprecation, Privacy Sandbox
]
```

**Step 4: Validate and commit**

```bash
git commit -m "feat: add Phases 7-8 and cross-cutting concerns (ecosystem, competitors, privacy)"
```

---

### Task 8: Final Content Validation

**Files:**
- Read: `data/lifecycle_data.json`

**Step 1: Run JSON schema validation**

```bash
cat data/lifecycle_data.json | python -m json.tool > /dev/null && echo "Valid JSON"
```

**Step 2: Count content**

```bash
# Count phases
cat data/lifecycle_data.json | python -c "import json,sys; d=json.load(sys.stdin); print(f'Phases: {len(d[\"phases\"])}')"

# Count total nodes (recursive)
cat data/lifecycle_data.json | python -c "
import json,sys
def count_nodes(node):
    count = 1
    for child in node.get('children', []):
        count += count_nodes(child)
    return count
d=json.load(sys.stdin)
total = sum(count_nodes(p) for p in d['phases'])
print(f'Total nodes: {total}')
"
```

Expected: Phases: 8, Total nodes: 200+

**Step 3: Commit final validation**

```bash
git commit -m "chore: validate lifecycle_data.json completeness"
```

---

## Phase 2: React Flow UI

### Task 9: Scaffold Next.js + React Flow Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest google-ads-lifecycle-ui --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd google-ads-lifecycle-ui
```

**Step 2: Install dependencies**

```bash
npm install reactflow zustand lucide-react
npm install -D @types/node
npx shadcn-ui@latest init
```

Select: New York style, Slate base color, CSS variables: yes

**Step 3: Add shadcn components**

```bash
npx shadcn-ui@latest add button card tabs badge input scroll-area sheet
```

**Step 4: Copy lifecycle_data.json**

```bash
cp ../data/lifecycle_data.json ./data/
```

**Step 5: Verify setup**

```bash
npm run dev
```

Open http://localhost:3000 - should see Next.js welcome page.

**Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js + React Flow + Tailwind project"
```

---

### Task 10: Create TypeScript Types

**Files:**
- Create: `lib/types.ts`

**Step 1: Define data types**

```typescript
// lib/types.ts

export type Priority = 'must_know_cold' | 'know_well' | 'conceptual_awareness';

export type Category =
  | 'web_tech'
  | 'databases_sql'
  | 'big_data'
  | 'ai_ml'
  | 'digital_marketing'
  | 'security'
  | 'data_pipelines'
  | 'architecture';

export interface TroubleshootingCause {
  cause: string;
  probability: 'high' | 'medium' | 'low';
  resolution: string;
  verification: string;
}

export interface Troubleshooting {
  symptoms: string[];
  diagnosticQuestions: string[];
  causes: TroubleshootingCause[];
}

export interface LifecycleNode {
  id: string;
  name: string;
  parentId?: string;
  priority: Priority;
  category: Category;
  definition?: string;
  adsContext?: string;
  tscRelevance?: string;
  keyDetails?: string[];
  interviewQuestions?: string[];
  sqlConnection?: string | null;
  troubleshooting?: Troubleshooting;
  tools?: string[];
  children?: LifecycleNode[];
  // Phase-specific
  phaseNumber?: number;
  funnelStage?: string;
  summary?: string;
  dataFlowIn?: string;
  dataFlowOut?: string;
}

export interface GoogleProduct {
  product: string;
  description: string;
  phasesInvolved: string[];
  dataSent: string;
  dataReceived: string;
  commonTscIssues: string[];
}

export interface Competitor {
  name: string;
  coreProducts: string;
  coreStrength: string;
  threatToGoogle: string;
  googleResponse: string;
}

export interface PrivacyConcept {
  concept: string;
  definition: string;
  adsContext: string;
  affectedPhases: string[];
}

export interface LifecycleData {
  meta: {
    title: string;
    version: string;
    lastUpdated: string;
    interviewDate: string;
  };
  phases: LifecycleNode[];
  crossCutting: {
    googleEcosystem: GoogleProduct[];
    competitors: Competitor[];
    privacyConsent: PrivacyConcept[];
  };
}
```

**Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for lifecycle data"
```

---

### Task 11: Create Zustand Store

**Files:**
- Create: `lib/store.ts`

**Step 1: Create store with filter state**

```typescript
// lib/store.ts

import { create } from 'zustand';
import { LifecycleNode, Priority, Category } from './types';

interface StoreState {
  // Selection
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Expansion
  expandedNodeIds: Set<string>;
  toggleExpanded: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // Filters
  priorityFilter: Priority | 'all';
  setPriorityFilter: (filter: Priority | 'all') => void;
  categoryFilter: Category | 'all';
  setCategoryFilter: (filter: Category | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarTab: 'detail' | 'ecosystem' | 'competitors' | 'privacy';
  setSidebarTab: (tab: 'detail' | 'ecosystem' | 'competitors' | 'privacy') => void;
}

export const useStore = create<StoreState>((set) => ({
  // Selection
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Expansion
  expandedNodeIds: new Set(),
  toggleExpanded: (id) => set((state) => {
    const newSet = new Set(state.expandedNodeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return { expandedNodeIds: newSet };
  }),
  expandAll: () => set({ expandedNodeIds: new Set() }), // Implement with all IDs
  collapseAll: () => set({ expandedNodeIds: new Set() }),

  // Filters
  priorityFilter: 'all',
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),
  categoryFilter: 'all',
  setCategoryFilter: (filter) => set({ categoryFilter: filter }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sidebarTab: 'detail',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
}));
```

**Step 2: Commit**

```bash
git add lib/store.ts
git commit -m "feat: add Zustand store for UI state"
```

---

### Task 12: Create Custom React Flow Nodes

**Files:**
- Create: `components/flow/PhaseNode.tsx`
- Create: `components/flow/SubProcessNode.tsx`
- Create: `components/flow/ConceptNode.tsx`

**Step 1: Create PhaseNode**

```tsx
// components/flow/PhaseNode.tsx

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LifecycleNode, Priority } from '@/lib/types';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const priorityStyles: Record<Priority, string> = {
  must_know_cold: 'border-red-500 border-[3px] bg-gradient-to-br from-white to-red-50 shadow-red-200',
  know_well: 'border-amber-500 border-2 bg-gradient-to-br from-white to-amber-50 shadow-amber-200',
  conceptual_awareness: 'border-blue-500 border bg-gradient-to-br from-white to-blue-50',
};

const categoryColors: Record<string, string> = {
  web_tech: 'bg-blue-600',
  databases_sql: 'bg-purple-600',
  big_data: 'bg-orange-500',
  ai_ml: 'bg-green-600',
  digital_marketing: 'bg-red-600',
  security: 'bg-gray-600',
  data_pipelines: 'bg-teal-600',
  architecture: 'bg-blue-500',
};

interface PhaseNodeData {
  node: LifecycleNode;
}

export const PhaseNode = memo(({ data, id }: NodeProps<PhaseNodeData>) => {
  const { node } = data;
  const { selectedNodeId, setSelectedNodeId, expandedNodeIds, toggleExpanded } = useStore();

  const isSelected = selectedNodeId === id;
  const isExpanded = expandedNodeIds.has(id);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    setSelectedNodeId(id);
  };

  const handleDoubleClick = () => {
    if (hasChildren) {
      toggleExpanded(id);
    }
  };

  return (
    <div
      className={cn(
        'w-[200px] min-h-[120px] rounded-xl p-4 cursor-pointer transition-all',
        'hover:shadow-lg hover:-translate-y-0.5',
        priorityStyles[node.priority],
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />

      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Phase {node.phaseNumber}
        </span>
        {hasChildren && (
          isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <h3 className="font-medium text-gray-900 text-[15px] leading-tight mb-2">
        {node.name}
      </h3>

      <div className="flex items-center gap-2 mt-auto">
        <Badge className={cn('text-white text-[11px]', categoryColors[node.category])}>
          {node.category.replace('_', ' ')}
        </Badge>
        {hasChildren && (
          <Badge variant="secondary" className="text-[11px]">
            {node.children!.length} items
          </Badge>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-gray-400" />
    </div>
  );
});

PhaseNode.displayName = 'PhaseNode';
```

**Step 2: Create SubProcessNode and ConceptNode** (similar pattern, smaller sizes)

**Step 3: Commit**

```bash
git add components/flow/
git commit -m "feat: add custom React Flow node components"
```

---

### Task 13: Build Main Flow Canvas

**Files:**
- Create: `components/FlowCanvas.tsx`
- Modify: `app/page.tsx`

**Step 1: Create FlowCanvas component**

```tsx
// components/FlowCanvas.tsx

'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PhaseNode } from './flow/PhaseNode';
import { SubProcessNode } from './flow/SubProcessNode';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData, LifecycleNode } from '@/lib/types';

const nodeTypes = {
  phase: PhaseNode,
  subprocess: SubProcessNode,
};

function buildNodesAndEdges(data: LifecycleData) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Position phases horizontally
  data.phases.forEach((phase, index) => {
    nodes.push({
      id: phase.id,
      type: 'phase',
      position: { x: index * 280, y: 100 },
      data: { node: phase },
    });

    // Connect phases
    if (index > 0) {
      edges.push({
        id: `e-${data.phases[index - 1].id}-${phase.id}`,
        source: data.phases[index - 1].id,
        target: phase.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#64748b', strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
}

export function FlowCanvas() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodesAndEdges(lifecycleData as LifecycleData),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'phase') return '#3b82f6';
            return '#94a3b8';
          }}
        />
      </ReactFlow>
    </div>
  );
}
```

**Step 2: Update app/page.tsx**

```tsx
// app/page.tsx

import { FlowCanvas } from '@/components/FlowCanvas';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <FlowCanvas />
    </main>
  );
}
```

**Step 3: Run and verify**

```bash
npm run dev
```

Expected: 8 phase nodes visible, connected by edges, draggable/zoomable.

**Step 4: Commit**

```bash
git add components/FlowCanvas.tsx app/page.tsx
git commit -m "feat: implement main React Flow canvas with phase nodes"
```

---

### Task 14: Add Header with Filters

**Files:**
- Create: `components/Header.tsx`
- Create: `components/filters/PriorityFilter.tsx`
- Create: `components/filters/SearchInput.tsx`

**Step 1: Create Header component with phase pills, search, and filters**

**Step 2: Wire up to Zustand store**

**Step 3: Commit**

```bash
git commit -m "feat: add header with phase navigation and filters"
```

---

### Task 15: Build Detail Panel (Sidebar)

**Files:**
- Create: `components/panels/DetailPanel.tsx`

**Step 1: Create sliding panel with tabs**

Tabs: Overview | Technical | Troubleshooting | Tools | Interview

Display:
- Definition with highlighted `adsContext` and `tscRelevance`
- Key details as bullet list
- Troubleshooting decision tree
- Interview questions

**Step 2: Commit**

```bash
git commit -m "feat: add detail panel with content tabs"
```

---

### Task 16: Implement Node Expansion (Children)

**Files:**
- Modify: `components/FlowCanvas.tsx`
- Modify: `lib/store.ts`

**Step 1: Add logic to dynamically add child nodes when parent expands**

When user double-clicks a node:
1. If collapsed → add child nodes below parent, add edges
2. If expanded → remove child nodes and edges

Use dagre for auto-layout.

**Step 2: Install dagre**

```bash
npm install dagre @types/dagre
```

**Step 3: Commit**

```bash
git commit -m "feat: implement node expansion with dagre auto-layout"
```

---

### Task 17: Add Filter Logic (Dim Non-Matching)

**Files:**
- Modify: `components/FlowCanvas.tsx`
- Modify: `components/flow/PhaseNode.tsx`

**Step 1: Add opacity logic based on filter state**

If `priorityFilter !== 'all'` and node priority doesn't match → opacity 0.2
If `searchQuery` and node doesn't match → opacity 0.2

**Step 2: Commit**

```bash
git commit -m "feat: implement filter dimming for non-matching nodes"
```

---

### Task 18: Build Ecosystem & Competitor Panels

**Files:**
- Create: `components/panels/EcosystemPanel.tsx`
- Create: `components/panels/CompetitorPanel.tsx`

**Step 1: Create ecosystem panel showing Google products with data flows**

**Step 2: Create competitor comparison cards**

**Step 3: Commit**

```bash
git commit -m "feat: add ecosystem and competitor sidebar panels"
```

---

### Task 19: Static Export & Final Polish

**Files:**
- Modify: `next.config.js`

**Step 1: Configure static export**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
module.exports = nextConfig;
```

**Step 2: Build static export**

```bash
npm run build
```

Output in `out/` folder - can be opened directly in browser.

**Step 3: Test static export**

```bash
npx serve out
```

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: configure static export and final polish"
```

---

## Summary

| Phase | Tasks | Est. Commits |
|-------|-------|--------------|
| Phase 1 (Content) | Tasks 1-8 | 8 commits |
| Phase 2 (UI) | Tasks 9-19 | 11 commits |
| **Total** | **19 tasks** | **~19 commits** |

---

## Execution

Plan complete and saved to `docs/plans/2026-02-15-react-flow-migration-implementation.md`.

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
