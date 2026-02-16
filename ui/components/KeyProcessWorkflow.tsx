'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { keyProcesses } from './Header';
import { X, ChevronRight, Globe, Server, Shield, Database, Code, Zap, Clock, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Process workflow data with steps and considerations
const processWorkflows: Record<string, {
  title: string;
  subtitle: string;
  steps: {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    description: string;
    considerations: {
      title: string;
      type: 'info' | 'warning' | 'success';
      content: string;
    }[];
  }[];
}> = {
  'url-enter': {
    title: 'What Happens When You Type a URL',
    subtitle: 'The complete journey from keystroke to rendered page',
    steps: [
      {
        id: 'dns',
        title: 'DNS Resolution',
        icon: Globe,
        color: 'from-blue-500 to-cyan-500',
        description: 'Convert domain name to IP address',
        considerations: [
          { title: 'Cache Cascade', type: 'info', content: 'Browser → OS → Router → ISP recursive resolver → DNS hierarchy (Root → TLD → Authoritative)' },
          { title: 'TTL Impact', type: 'warning', content: 'Low TTL = faster changes but more lookups. Affects landing page performance.' },
        ],
      },
      {
        id: 'tcp',
        title: 'TCP Handshake',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
        description: 'Establish reliable connection',
        considerations: [
          { title: 'Three-Way', type: 'info', content: 'SYN → SYN-ACK → ACK. Costs 1 RTT (100ms on mobile networks).' },
          { title: 'Mobile Impact', type: 'warning', content: 'Higher latency on mobile makes each handshake more expensive.' },
        ],
      },
      {
        id: 'tls',
        title: 'TLS Handshake',
        icon: Shield,
        color: 'from-purple-500 to-pink-500',
        description: 'Encrypt the connection',
        considerations: [
          { title: 'TLS 1.3 vs 1.2', type: 'success', content: 'TLS 1.3 = 1 RTT, TLS 1.2 = 2 RTT. Recommend TLS 1.3.' },
          { title: 'Required for Tracking', type: 'warning', content: 'HTTPS required for Google Ads conversion tracking.' },
        ],
      },
      {
        id: 'http',
        title: 'HTTP Request',
        icon: Server,
        color: 'from-orange-500 to-amber-500',
        description: 'Request and receive page content',
        considerations: [
          { title: 'Key Headers', type: 'info', content: 'Host, User-Agent, Cookie (contains GCLID), Accept, Cache-Control' },
          { title: 'HTTP/2 Multiplexing', type: 'success', content: 'Multiple requests over single TCP connection. Eliminates head-of-line blocking.' },
        ],
      },
      {
        id: 'render',
        title: 'Browser Rendering',
        icon: Code,
        color: 'from-red-500 to-rose-500',
        description: 'Parse HTML, build DOM, render pixels',
        considerations: [
          { title: 'Render Pipeline', type: 'info', content: 'HTML → DOM tree → CSSOM tree → Render tree → Layout → Paint → Composite' },
          { title: 'Core Web Vitals', type: 'success', content: 'LCP < 2.5s, INP < 200ms, CLS < 0.1 — affects Quality Score' },
        ],
      },
    ],
  },
  'ad-click-journey': {
    title: 'The Journey of an Ad Click',
    subtitle: 'From user click to landing page with GCLID tracking',
    steps: [
      {
        id: 'search',
        title: 'User Search',
        icon: Globe,
        color: 'from-blue-500 to-indigo-500',
        description: 'User enters query on Google',
        considerations: [
          { title: 'Intent Signal', type: 'info', content: 'Search query represents declared purchase intent — Google\'s core advantage.' },
        ],
      },
      {
        id: 'auction',
        title: 'Ad Auction',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        description: 'Real-time auction in <100ms',
        considerations: [
          { title: 'Ad Rank', type: 'info', content: 'Max Bid × Quality Score × Expected impact of extensions' },
          { title: 'Second Price', type: 'success', content: 'Pay minimum needed to beat next competitor. Encourages truthful bidding.' },
        ],
      },
      {
        id: 'click',
        title: 'Ad Click',
        icon: CheckCircle2,
        color: 'from-green-500 to-teal-500',
        description: 'User clicks ad → goes to Google first',
        considerations: [
          { title: '302 Redirect', type: 'warning', content: 'Click goes to googleadservices.com FIRST. Google logs click, charges advertiser.' },
          { title: 'Parallel Tracking', type: 'success', content: 'Landing page loads simultaneously with tracking URL.' },
        ],
      },
      {
        id: 'gclid',
        title: 'GCLID Append',
        icon: Database,
        color: 'from-purple-500 to-violet-500',
        description: 'GCLID added to landing page URL',
        considerations: [
          { title: 'Join Key', type: 'info', content: 'GCLID uniquely identifies this click. Bridges click → conversion attribution.' },
          { title: 'URL Stripping', type: 'warning', content: 'If CMS/redirects strip GCLID, conversion tracking breaks entirely.' },
        ],
      },
      {
        id: 'cookie',
        title: 'Cookie Storage',
        icon: Shield,
        color: 'from-red-500 to-pink-500',
        description: 'GCLID stored in first-party cookie',
        considerations: [
          { title: '90-Day Lookback', type: 'info', content: 'Default cookie expiration. User can convert within this window.' },
          { title: 'Safari ITP', type: 'warning', content: 'Safari limits cookies to 7 days. Enhanced Conversions helps bridge this gap.' },
        ],
      },
    ],
  },
  'click-conversion': {
    title: 'Click-to-Conversion Tracking',
    subtitle: 'How conversions are attributed to ad clicks',
    steps: [
      {
        id: 'click',
        title: 'Ad Click',
        icon: CheckCircle2,
        color: 'from-blue-500 to-cyan-500',
        description: 'GCLID appended to URL',
        considerations: [
          { title: 'Unique Identifier', type: 'info', content: 'GCLID = encrypted string uniquely identifying this click.' },
        ],
      },
      {
        id: 'store',
        title: 'Cookie Storage',
        icon: Database,
        color: 'from-green-500 to-emerald-500',
        description: 'gtag.js stores GCLID in cookie',
        considerations: [
          { title: 'First-Party', type: 'success', content: 'Cookie on advertiser\'s domain. NOT affected by 3P cookie deprecation.' },
          { title: 'Domain Scope', type: 'warning', content: 'Use .advertiser.com (with dot) for cross-subdomain tracking.' },
        ],
      },
      {
        id: 'browse',
        title: 'User Journey',
        icon: Clock,
        color: 'from-yellow-500 to-amber-500',
        description: 'User may leave and return later',
        considerations: [
          { title: 'Persistence', type: 'info', content: 'Cookie persists across sessions (unless cleared or ITP expires it).' },
        ],
      },
      {
        id: 'convert',
        title: 'Conversion',
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        description: 'User completes valuable action',
        considerations: [
          { title: 'Tag Fires', type: 'info', content: 'gtag.js reads GCLID from cookie, sends POST to googleadservices.com' },
          { title: 'transaction_id', type: 'warning', content: 'Include unique order ID to prevent duplicate conversions on page refresh.' },
        ],
      },
      {
        id: 'attribute',
        title: 'Attribution',
        icon: CheckCircle2,
        color: 'from-red-500 to-rose-500',
        description: 'Conversion matched to original click',
        considerations: [
          { title: 'GCLID Match', type: 'success', content: 'Google looks up GCLID → finds original campaign, ad group, keyword.' },
          { title: 'Smart Bidding', type: 'success', content: 'Attribution data feeds ML models for bid optimization.' },
        ],
      },
    ],
  },
  'auction': {
    title: 'How the Google Ads Auction Works',
    subtitle: 'Real-time auction mechanics and Ad Rank calculation',
    steps: [
      {
        id: 'query',
        title: 'Search Query',
        icon: Globe,
        color: 'from-blue-500 to-indigo-500',
        description: 'User enters search query',
        considerations: [
          { title: 'Keyword Match', type: 'info', content: 'Google identifies eligible advertisers based on keyword match types + ML semantic matching.' },
        ],
      },
      {
        id: 'rank',
        title: 'Ad Rank Calc',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        description: 'Calculate Ad Rank for each advertiser',
        considerations: [
          { title: 'Formula', type: 'info', content: 'Ad Rank = Max Bid × Quality Score × Expected extension impact' },
          { title: 'Real-Time', type: 'success', content: 'Calculated per-query in <100ms. 8.5B+ auctions daily.' },
        ],
      },
      {
        id: 'quality',
        title: 'Quality Score',
        icon: CheckCircle2,
        color: 'from-green-500 to-emerald-500',
        description: '3 components: CTR, Relevance, Landing Page',
        considerations: [
          { title: 'CTR', type: 'info', content: 'Expected click-through rate based on historical performance.' },
          { title: 'Ad Relevance', type: 'info', content: 'How well ad copy matches search intent.' },
          { title: 'Landing Page', type: 'warning', content: 'Page quality, speed, Core Web Vitals. This is where web tech impacts ads.' },
        ],
      },
      {
        id: 'position',
        title: 'Position & Pricing',
        icon: Database,
        color: 'from-purple-500 to-violet-500',
        description: 'Rank by Ad Rank, price via GSP',
        considerations: [
          { title: 'Second Price', type: 'success', content: 'Pay minimum to beat next competitor\'s Ad Rank, not your max bid.' },
          { title: 'Quality Advantage', type: 'success', content: 'QS 10 can outrank competitor bidding 2x higher with QS 4.' },
        ],
      },
    ],
  },
  'http-status': {
    title: 'HTTP Status Codes',
    subtitle: 'Understanding server responses for troubleshooting',
    steps: [
      {
        id: '2xx',
        title: '2xx Success',
        icon: CheckCircle2,
        color: 'from-green-500 to-emerald-500',
        description: 'Request succeeded',
        considerations: [
          { title: '200 OK', type: 'success', content: 'Standard success. Server processed request and returned content.' },
          { title: '201 Created', type: 'success', content: 'New resource created. Response to POST request.' },
          { title: '204 No Content', type: 'info', content: 'Success but no body. Common for DELETE responses.' },
        ],
      },
      {
        id: '3xx',
        title: '3xx Redirect',
        icon: ArrowRight,
        color: 'from-blue-500 to-cyan-500',
        description: 'Go somewhere else',
        considerations: [
          { title: '301 Permanent', type: 'info', content: 'Permanent redirect. Browser caches it. Use for domain migrations.' },
          { title: '302 Temporary', type: 'warning', content: 'Google uses for ad click tracking. NOT cached. Each click tracked.' },
          { title: '304 Not Modified', type: 'success', content: 'Use cached version. Saves bandwidth.' },
        ],
      },
      {
        id: '4xx',
        title: '4xx Client Error',
        icon: AlertTriangle,
        color: 'from-yellow-500 to-orange-500',
        description: 'Request was wrong',
        considerations: [
          { title: '401 vs 403', type: 'warning', content: '401 = not authenticated (who are you?). 403 = not authorized (no permission).' },
          { title: '404 Not Found', type: 'warning', content: 'On landing page → ad disapproval, wasted spend, user bounces.' },
          { title: '429 Rate Limited', type: 'info', content: 'Google Ads API rate limit. Implement exponential backoff.' },
        ],
      },
      {
        id: '5xx',
        title: '5xx Server Error',
        icon: AlertTriangle,
        color: 'from-red-500 to-rose-500',
        description: 'Server broke',
        considerations: [
          { title: '500 Internal', type: 'warning', content: 'Generic server failure. Could be unhandled exception, misconfig.' },
          { title: '502 Bad Gateway', type: 'info', content: 'Proxy received invalid response from upstream server.' },
          { title: '503 Unavailable', type: 'warning', content: 'Server overloaded/maintenance. TSC: advise pausing ads immediately.' },
        ],
      },
    ],
  },
  'security': {
    title: 'Internet Security',
    subtitle: 'Authentication, Authorization, and Encryption',
    steps: [
      {
        id: 'authn',
        title: 'Authentication',
        icon: Shield,
        color: 'from-blue-500 to-indigo-500',
        description: 'Who are you?',
        considerations: [
          { title: 'Methods', type: 'info', content: 'Username/password, 2FA, session cookies, OAuth 2.0 tokens.' },
          { title: 'OAuth 2.0', type: 'success', content: 'Google Ads API uses OAuth. Scoped access without sharing password.' },
        ],
      },
      {
        id: 'authz',
        title: 'Authorization',
        icon: CheckCircle2,
        color: 'from-green-500 to-emerald-500',
        description: 'What can you do?',
        considerations: [
          { title: 'Scopes', type: 'info', content: 'OAuth scopes define exact permissions. Read-only vs write access.' },
          { title: 'IAM', type: 'info', content: 'BigQuery access controlled via Google Cloud IAM roles.' },
        ],
      },
      {
        id: 'encrypt',
        title: 'Encryption',
        icon: Shield,
        color: 'from-purple-500 to-pink-500',
        description: 'No eavesdropping',
        considerations: [
          { title: 'TLS/HTTPS', type: 'success', content: 'Encrypts data in transit. Required for conversion tracking.' },
          { title: 'Symmetric vs Asymmetric', type: 'info', content: 'Asymmetric (slow) exchanges session key → Symmetric (fast) for data.' },
        ],
      },
      {
        id: 'csp',
        title: 'CSP & CORS',
        icon: AlertTriangle,
        color: 'from-orange-500 to-amber-500',
        description: 'Browser security policies',
        considerations: [
          { title: 'CSP Blocking', type: 'warning', content: 'Strict CSP can block GTM/gtag.js. Whitelist Google domains.' },
          { title: 'CORS', type: 'info', content: 'Controls cross-origin requests. Preflight OPTIONS request checks headers.' },
        ],
      },
    ],
  },
  'page-speed': {
    title: 'How to Reduce Page Load Time',
    subtitle: 'Optimizations that improve Quality Score',
    steps: [
      {
        id: 'diagnose',
        title: 'Diagnose First',
        icon: Globe,
        color: 'from-blue-500 to-cyan-500',
        description: 'Use DevTools Network waterfall',
        considerations: [
          { title: 'Check TTFB', type: 'info', content: 'High TTFB = server processing problem. Check database/application.' },
          { title: 'Find Bottleneck', type: 'warning', content: 'Is it DNS, server, download size, or render blocking?' },
        ],
      },
      {
        id: 'network',
        title: 'Network Optimizations',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
        description: 'CDN, prefetch, preconnect',
        considerations: [
          { title: 'CDN', type: 'success', content: 'Serve static assets from edge servers near user. Reduces TTFB.' },
          { title: 'Preconnect', type: 'success', content: '<link rel="preconnect"> completes DNS+TCP+TLS ahead of time.' },
        ],
      },
      {
        id: 'resources',
        title: 'Resource Optimizations',
        icon: Code,
        color: 'from-purple-500 to-pink-500',
        description: 'Minify, compress, optimize images',
        considerations: [
          { title: 'Compression', type: 'success', content: 'Brotli > Gzip. 15-25% smaller for text assets.' },
          { title: 'Images', type: 'success', content: 'WebP/AVIF, lazy loading, srcset for responsive sizes.' },
        ],
      },
      {
        id: 'render',
        title: 'Render Optimizations',
        icon: CheckCircle2,
        color: 'from-orange-500 to-amber-500',
        description: 'async/defer, critical CSS',
        considerations: [
          { title: 'Script Loading', type: 'info', content: 'defer = execute after DOM. async = execute when ready. GTM uses async.' },
          { title: 'CLS Prevention', type: 'warning', content: 'Specify image width/height to prevent layout shift.' },
        ],
      },
    ],
  },
  'account-hierarchy': {
    title: 'Google Ads Account Hierarchy',
    subtitle: 'Account → Campaign → Ad Group structure',
    steps: [
      {
        id: 'account',
        title: 'Account',
        icon: Globe,
        color: 'from-blue-500 to-indigo-500',
        description: 'Top level: billing, access, timezone',
        considerations: [
          { title: 'CID', type: 'info', content: 'Customer ID: unique 10-digit identifier (xxx-xxx-xxxx).' },
          { title: 'Immutable', type: 'warning', content: 'Currency and timezone cannot be changed after creation.' },
        ],
      },
      {
        id: 'campaign',
        title: 'Campaign',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
        description: 'Budget, targeting, bidding strategy',
        considerations: [
          { title: 'Strategic Intent', type: 'info', content: '"I want to spend $50K/month on European hotels"' },
          { title: 'Campaign Types', type: 'info', content: 'Search, Display, Video, Shopping, PMax, Demand Gen, App' },
        ],
      },
      {
        id: 'adgroup',
        title: 'Ad Group',
        icon: Database,
        color: 'from-purple-500 to-violet-500',
        description: 'Keywords, audiences, ads, bids',
        considerations: [
          { title: 'Tactical', type: 'info', content: 'Themed groupings: "Paris Luxury Hotels" vs "Amsterdam Budget Hotels"' },
          { title: 'Bid Level', type: 'warning', content: 'Ad group bids override campaign default (for manual bidding).' },
        ],
      },
      {
        id: 'keywords',
        title: 'Keywords + Ads',
        icon: CheckCircle2,
        color: 'from-red-500 to-rose-500',
        description: 'Search terms and creatives',
        considerations: [
          { title: 'Match Types', type: 'info', content: 'Broad, Phrase, Exact — control which searches trigger ads.' },
          { title: 'Relational Model', type: 'success', content: 'account_id → campaign_id → ad_group_id → keyword_id. Foreign key chain.' },
        ],
      },
    ],
  },
  'troubleshooting': {
    title: 'The Troubleshooting Framework',
    subtitle: 'Structured approach to diagnosing issues',
    steps: [
      {
        id: 'clarify',
        title: '1. CLARIFY',
        icon: Globe,
        color: 'from-blue-500 to-cyan-500',
        description: 'Ask questions before touching anything',
        considerations: [
          { title: 'What', type: 'info', content: 'What exactly is the symptom? Quantify: down by how much? Since when?' },
          { title: 'When', type: 'info', content: 'When did it start? Any recent changes?' },
          { title: 'Scope', type: 'warning', content: 'All campaigns or one? All devices? All regions? All browsers?' },
        ],
      },
      {
        id: 'isolate',
        title: '2. ISOLATE',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
        description: 'Find where the break occurs',
        considerations: [
          { title: 'Metric Chain', type: 'info', content: 'Conversions → CTR/Conv Rate → Clicks/Impressions → Budget/Targeting/Bid' },
          { title: 'Tools', type: 'success', content: 'DevTools, GTM Preview, Tag Assistant, BigQuery' },
        ],
      },
      {
        id: 'hypothesize',
        title: '3. HYPOTHESIZE',
        icon: Database,
        color: 'from-purple-500 to-pink-500',
        description: 'Rank 2-3 likely causes',
        considerations: [
          { title: 'Probability', type: 'info', content: 'Order hypotheses by likelihood. Test most likely first.' },
        ],
      },
      {
        id: 'test',
        title: '4. TEST',
        icon: CheckCircle2,
        color: 'from-orange-500 to-amber-500',
        description: 'Verify each hypothesis',
        considerations: [
          { title: 'Specific Checks', type: 'info', content: 'For each hypothesis: what data/test confirms or eliminates it?' },
        ],
      },
      {
        id: 'resolve',
        title: '5. RESOLVE',
        icon: CheckCircle2,
        color: 'from-red-500 to-rose-500',
        description: 'Fix and verify',
        considerations: [
          { title: 'Document', type: 'success', content: 'What broke, why, how fixed, prevention for future.' },
        ],
      },
    ],
  },
  'bigquery': {
    title: 'BigQuery - What It Is',
    subtitle: 'Google\'s serverless cloud data warehouse',
    steps: [
      {
        id: 'what',
        title: 'What Is It',
        icon: Database,
        color: 'from-blue-500 to-indigo-500',
        description: 'Petabyte-scale SQL analytics',
        considerations: [
          { title: 'Serverless', type: 'success', content: 'No infrastructure to manage. Pay per query (bytes scanned).' },
          { title: 'Standard SQL', type: 'info', content: 'Familiar SQL syntax for ad performance analysis.' },
        ],
      },
      {
        id: 'columnar',
        title: 'Columnar Storage',
        icon: Code,
        color: 'from-green-500 to-emerald-500',
        description: 'Only read columns you need',
        considerations: [
          { title: 'Speed', type: 'success', content: 'Query only reads campaign_name and clicks columns, skips rest.' },
          { title: 'Cost', type: 'warning', content: 'SELECT * scans ALL columns = expensive. Always select specific columns.' },
        ],
      },
      {
        id: 'partition',
        title: 'Partitioning',
        icon: Database,
        color: 'from-purple-500 to-pink-500',
        description: 'Split table by date',
        considerations: [
          { title: 'Pruning', type: 'success', content: 'WHERE date BETWEEN ... only scans matching partitions.' },
          { title: 'Critical', type: 'warning', content: 'Always include partition filter to control costs.' },
        ],
      },
      {
        id: 'transfer',
        title: 'Data Transfer',
        icon: Zap,
        color: 'from-orange-500 to-amber-500',
        description: 'Automated Google Ads export',
        considerations: [
          { title: 'Automatic', type: 'success', content: 'BigQuery Data Transfer Service runs daily scheduled exports.' },
          { title: 'Micros', type: 'warning', content: 'Cost stored in micros (÷1e6 for dollars). Common gotcha.' },
        ],
      },
    ],
  },
  'sql-patterns': {
    title: 'SQL Query Patterns for Ad Data',
    subtitle: 'Essential patterns for ad performance analysis',
    steps: [
      {
        id: 'basics',
        title: 'Aggregation',
        icon: Database,
        color: 'from-blue-500 to-cyan-500',
        description: 'SUM, GROUP BY, HAVING',
        considerations: [
          { title: 'SAFE_DIVIDE', type: 'success', content: 'SAFE_DIVIDE(clicks, impressions) returns NULL on zero, not error.' },
          { title: 'HAVING', type: 'info', content: 'HAVING filters groups AFTER aggregation (vs WHERE before).' },
        ],
      },
      {
        id: 'windows',
        title: 'Window Functions',
        icon: Code,
        color: 'from-green-500 to-emerald-500',
        description: 'Running totals, moving averages',
        considerations: [
          { title: 'OVER()', type: 'info', content: 'PARTITION BY groups, ORDER BY sorts, ROWS defines frame.' },
          { title: 'No Collapse', type: 'success', content: 'Unlike GROUP BY, keeps all rows while computing across related rows.' },
        ],
      },
      {
        id: 'lag',
        title: 'LAG/LEAD',
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        description: 'Day-over-day change detection',
        considerations: [
          { title: 'Anomaly Detection', type: 'success', content: 'LAG(conversions, 1) gets yesterday. Calculate % change.' },
          { title: 'QUALIFY', type: 'info', content: 'BigQuery-specific. Filter window results like HAVING for aggregates.' },
        ],
      },
      {
        id: 'ctes',
        title: 'CTEs',
        icon: CheckCircle2,
        color: 'from-orange-500 to-amber-500',
        description: 'WITH clause for readability',
        considerations: [
          { title: 'Funnel Analysis', type: 'success', content: 'Build funnel stages as CTEs, then calculate drop-off rates.' },
          { title: 'Readability', type: 'info', content: 'Named steps make complex queries maintainable.' },
        ],
      },
    ],
  },
  'cookies': {
    title: 'Cookies in Ad Tracking',
    subtitle: 'First-party vs third-party and the privacy shift',
    steps: [
      {
        id: 'first',
        title: 'First-Party Cookies',
        icon: CheckCircle2,
        color: 'from-green-500 to-emerald-500',
        description: 'Set by the domain you\'re visiting',
        considerations: [
          { title: 'GCLID Storage', type: 'success', content: 'GCLID stored as first-party cookie on advertiser.com.' },
          { title: 'Not Deprecated', type: 'success', content: 'First-party cookies NOT affected by 3P cookie death.' },
        ],
      },
      {
        id: 'third',
        title: 'Third-Party Cookies',
        icon: AlertTriangle,
        color: 'from-red-500 to-rose-500',
        description: 'Set by a different domain',
        considerations: [
          { title: 'Cross-Site Tracking', type: 'warning', content: 'Used for building behavioral profiles across sites.' },
          { title: 'Being Killed', type: 'warning', content: 'Safari ITP blocks. Firefox blocks. Chrome deprecating.' },
        ],
      },
      {
        id: 'attrs',
        title: 'Cookie Attributes',
        icon: Shield,
        color: 'from-purple-500 to-pink-500',
        description: 'Domain, SameSite, Secure, HttpOnly',
        considerations: [
          { title: 'Domain', type: 'warning', content: '.advertiser.com (with dot) enables cross-subdomain reading.' },
          { title: 'SameSite', type: 'info', content: 'Strict/Lax/None controls cross-site sending. Chrome defaults Lax.' },
        ],
      },
      {
        id: 'itp',
        title: 'Safari ITP',
        icon: AlertTriangle,
        color: 'from-orange-500 to-amber-500',
        description: '7-day JavaScript cookie limit',
        considerations: [
          { title: 'Impact', type: 'warning', content: 'Click Monday, convert 8 days later → GCLID expired → lost conversion.' },
          { title: 'Solution', type: 'success', content: 'Enhanced Conversions sends hashed email to match via identity.' },
        ],
      },
    ],
  },
  'gtm': {
    title: 'GTM Architecture and DataLayer',
    subtitle: 'How enterprise tracking is implemented',
    steps: [
      {
        id: 'container',
        title: 'GTM Container',
        icon: Code,
        color: 'from-blue-500 to-indigo-500',
        description: 'Single script loads all tags',
        considerations: [
          { title: 'Installation', type: 'info', content: 'Short JS snippet in <head>. No need to add individual tracking scripts.' },
          { title: 'vs gtag.js', type: 'info', content: 'GTM = management layer. gtag.js = direct implementation.' },
        ],
      },
      {
        id: 'datalayer',
        title: 'DataLayer',
        icon: Database,
        color: 'from-green-500 to-emerald-500',
        description: 'JavaScript array for data',
        considerations: [
          { title: 'Contract', type: 'info', content: 'Developers push structured data, GTM reads it. Decouples tracking from code.' },
          { title: '#1 Bug Source', type: 'warning', content: 'Wrong event name, misspelled key, missing value = tracking breaks.' },
        ],
      },
      {
        id: 'triggers',
        title: 'Triggers',
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        description: 'Rules for WHEN tags fire',
        considerations: [
          { title: 'Types', type: 'info', content: 'Page View, Click, Custom Event, DOM Ready, Form Submission' },
          { title: 'Custom Event', type: 'success', content: 'Fires when dataLayer.push({event: "purchase"}) matches.' },
        ],
      },
      {
        id: 'variables',
        title: 'Variables',
        icon: Code,
        color: 'from-orange-500 to-amber-500',
        description: 'Extract values from dataLayer/URL/cookies',
        considerations: [
          { title: 'Data Layer Variable', type: 'info', content: 'Extracts transactionTotal, transaction_id, etc.' },
          { title: 'URL Variable', type: 'info', content: 'Reads query parameters like GCLID.' },
        ],
      },
      {
        id: 'tags',
        title: 'Tags',
        icon: CheckCircle2,
        color: 'from-red-500 to-rose-500',
        description: 'Actual tracking code that executes',
        considerations: [
          { title: 'Google Ads Conversion', type: 'success', content: 'Sends GCLID, value, transaction_id to googleadservices.com' },
          { title: 'Preview Mode', type: 'success', content: 'Debug exactly which tags fired, triggers matched, variable values.' },
        ],
      },
    ],
  },
  'ads-ga4-mismatch': {
    title: 'Why Google Ads and GA4 Numbers Don\'t Match',
    subtitle: 'Understanding the expected discrepancy',
    steps: [
      {
        id: 'attribution',
        title: 'Different Attribution',
        icon: Database,
        color: 'from-blue-500 to-cyan-500',
        description: 'Google-only vs cross-channel',
        considerations: [
          { title: 'Ads', type: 'info', content: 'Only considers Google Ads touchpoints (clicks, engaged views).' },
          { title: 'GA4', type: 'info', content: 'Considers ALL channels (organic, direct, social, email, Ads).' },
          { title: 'Result', type: 'warning', content: 'Same conversion may show 1.0 in Ads, 0.5 in GA4 for Ads channel.' },
        ],
      },
      {
        id: 'lookback',
        title: 'Different Lookbacks',
        icon: Clock,
        color: 'from-green-500 to-emerald-500',
        description: 'Varying conversion windows',
        considerations: [
          { title: 'Ads Default', type: 'info', content: '30-day click, 1-day view-through window.' },
          { title: 'GA4', type: 'info', content: 'Configurable, may differ from Ads settings.' },
        ],
      },
      {
        id: 'counting',
        title: 'Different Counting',
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        description: 'Every vs one conversion',
        considerations: [
          { title: 'Ads Setting', type: 'info', content: '"Every" = 1 click → 3 purchases = 3 conversions. "One" = 1 conversion.' },
          { title: 'GA4 Logic', type: 'info', content: 'Different session and user counting methodology.' },
        ],
      },
      {
        id: 'resolution',
        title: 'How to Handle',
        icon: CheckCircle2,
        color: 'from-orange-500 to-amber-500',
        description: 'Minimize gap, agree on truth',
        considerations: [
          { title: 'Not a Bug', type: 'success', content: 'Some difference is expected by design. Different questions being answered.' },
          { title: 'Best Practice', type: 'success', content: 'Align windows, use same conversion actions, document expected delta.' },
        ],
      },
    ],
  },
  'competition': {
    title: 'Competitive Landscape',
    subtitle: 'Google vs Meta vs Amazon vs TikTok',
    steps: [
      {
        id: 'google',
        title: 'Google',
        icon: Globe,
        color: 'from-blue-500 to-indigo-500',
        description: 'Search intent data',
        considerations: [
          { title: 'Strength', type: 'success', content: '8.5B+ daily searches. Captures declared purchase intent.' },
          { title: 'Revenue', type: 'info', content: '~$265B ad revenue (2024). Search ~60% of Alphabet revenue.' },
        ],
      },
      {
        id: 'meta',
        title: 'Meta',
        icon: Database,
        color: 'from-purple-500 to-pink-500',
        description: 'Social engagement signals',
        considerations: [
          { title: 'Strength', type: 'info', content: 'Interest, social connections, life events. Advantage+ AI automation.' },
          { title: 'Threat', type: 'warning', content: 'Strong mid-funnel engagement, Instagram Shopping.' },
        ],
      },
      {
        id: 'amazon',
        title: 'Amazon',
        icon: Zap,
        color: 'from-orange-500 to-amber-500',
        description: 'Purchase-intent at point of sale',
        considerations: [
          { title: 'Strength', type: 'info', content: 'Knows what people BUY, not just search. Closed-loop measurement.' },
          { title: 'Threat', type: 'warning', content: 'Capturing bottom-funnel spend that went to Google Shopping.' },
        ],
      },
      {
        id: 'tiktok',
        title: 'TikTok',
        icon: CheckCircle2,
        color: 'from-red-500 to-rose-500',
        description: 'Discovery-led demand creation',
        considerations: [
          { title: 'Strength', type: 'info', content: 'Creates demand BEFORE search intent. Gen Z using for product research.' },
          { title: 'Threat', type: 'warning', content: 'Challenges Google\'s core value prop of capturing existing intent.' },
        ],
      },
    ],
  },
};

// Get default empty workflow for processes without detailed steps
const getDefaultWorkflow = (processId: string) => {
  const process = keyProcesses.find(p => p.id === processId);
  return {
    title: process?.name || 'Process',
    subtitle: 'Select from Key Processes dropdown for details',
    steps: [],
  };
};

export function KeyProcessWorkflow() {
  const { selectedKeyProcess, setSelectedKeyProcess } = useStore();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (!selectedKeyProcess) return null;

  const workflow = processWorkflows[selectedKeyProcess] || getDefaultWorkflow(selectedKeyProcess);

  if (workflow.steps.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white via-white to-gray-50 border-t-2 border-blue-200 shadow-2xl z-40 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div>
          <h3 className="text-white font-semibold text-lg">{workflow.title}</h3>
          <p className="text-blue-100 text-sm">{workflow.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={() => setSelectedKeyProcess(null)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Steps */}
      <div className="px-6 py-6 overflow-x-auto">
        <div className="flex items-start gap-4 min-w-max">
          {workflow.steps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === step.id;

            return (
              <div key={step.id} className="flex items-start gap-4">
                {/* Step card */}
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                >
                  {/* Main step box */}
                  <div className={cn(
                    "w-44 rounded-xl overflow-hidden shadow-lg transition-all duration-300",
                    isExpanded ? "ring-2 ring-blue-400 ring-offset-2" : "hover:shadow-xl hover:-translate-y-1"
                  )}>
                    {/* Gradient header */}
                    <div className={cn("p-3 bg-gradient-to-r", step.color)}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm">{step.title}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 bg-white">
                      <p className="text-xs text-gray-600">{step.description}</p>
                      <div className="mt-2 flex items-center text-xs text-blue-500 font-medium">
                        <Info className="w-3 h-3 mr-1" />
                        {step.considerations.length} considerations
                        <ChevronRight className={cn(
                          "w-3 h-3 ml-auto transition-transform",
                          isExpanded && "rotate-90"
                        )} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded considerations */}
                  {isExpanded && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-3 space-y-2">
                        {step.considerations.map((cons, ci) => (
                          <div
                            key={ci}
                            className={cn(
                              "p-2 rounded-lg text-xs",
                              cons.type === 'info' && "bg-blue-50 border border-blue-100",
                              cons.type === 'warning' && "bg-amber-50 border border-amber-100",
                              cons.type === 'success' && "bg-green-50 border border-green-100"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {cons.type === 'info' && <Info className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />}
                              {cons.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />}
                              {cons.type === 'success' && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />}
                              <div>
                                <p className="font-medium text-gray-700">{cons.title}</p>
                                <p className="text-gray-600 mt-0.5">{cons.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow connector */}
                {index < workflow.steps.length - 1 && (
                  <div className="flex items-center self-center pt-8">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <ArrowRight className="w-5 h-5 text-gray-400 -ml-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
