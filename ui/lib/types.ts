// lib/types.ts
// TypeScript types for the Google Ads Lifecycle Study Tool data

export type Priority = 'must_know_cold' | 'know_well' | 'conceptual_awareness';

export type Category =
  | 'web_tech'
  | 'databases_sql'
  | 'big_data'
  | 'ai_ml'
  | 'digital_marketing'
  | 'security'
  | 'data_pipelines'
  | 'architecture'
  | 'account_structure'
  | 'campaign_management'
  | 'campaign_types'
  | 'strategy'
  | 'bidding'
  | 'targeting'
  | 'audience'
  | 'creatives'
  | 'tracking'
  | 'measurement'
  | 'attribution'
  | 'optimization_strategy'
  | 'troubleshooting'
  | 'keyword_optimization'
  | 'conversion_optimization'
  | 'reporting'
  | 'campaign_type'
  | 'competitive_intelligence';

export interface TroubleshootingCause {
  issue: string;
  probability: 'high' | 'medium' | 'low';
  resolution: string;
  verification: string;
}

export interface Troubleshooting {
  symptoms: string[];
  diagnosticQuestions: string[];
  causes: TroubleshootingCause[];
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface LifecycleNode {
  id: string;
  name: string;
  parentId?: string;
  priority: Priority;
  category: Category | string; // Allow string for extensibility
  definition?: string;
  adsContext?: string;
  tscRelevance?: string;
  keyDetails?: string[];
  interviewQuestions?: string[]; // Legacy: simple question strings
  interviewQA?: InterviewQA[]; // New: question + answer pairs
  sqlConnection?: string | null;
  troubleshooting?: Troubleshooting;
  tools?: string[];
  children?: LifecycleNode[];
  // Phase-specific fields (top-level phases)
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
  coreProducts: string[];
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

export interface CrossCutting {
  googleEcosystem: GoogleProduct[];
  competitors: Competitor[];
  privacyConsent: PrivacyConcept[];
}

export interface Meta {
  title: string;
  version: string;
  lastUpdated: string;
  interviewDate: string;
  description?: string;
}

export interface LifecycleData {
  meta: Meta;
  phases: LifecycleNode[];
  crossCutting: CrossCutting;
}

// Utility type for node lookup by ID
export type NodeMap = Map<string, LifecycleNode>;

// Type for search results
export interface SearchResult {
  node: LifecycleNode;
  matchedFields: string[];
  score: number;
}

// Type for breadcrumb navigation
export interface Breadcrumb {
  id: string;
  name: string;
}
