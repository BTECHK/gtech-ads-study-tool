'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe, Swords, Shield, Maximize2, Minimize2, X, ChevronDown, Zap } from 'lucide-react';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData, LifecycleNode } from '@/lib/types';
import { cn } from '@/lib/utils';

const phases = [1, 2, 3, 4, 5, 6, 7, 8];
const priorities = [
  { value: 'all', label: 'All', color: '' },
  { value: 'must_know_cold', label: 'Critical', color: 'bg-red-500' },
  { value: 'know_well', label: 'Important', color: 'bg-amber-500' },
  { value: 'conceptual_awareness', label: 'Awareness', color: 'bg-blue-500' },
] as const;

// 15 Key Processes for interview
export const keyProcesses = [
  { id: 'url-enter', name: 'What Happens When You Type a URL', criticality: 'must_know_cold', relatedNodes: ['p4-3', 'p4-4', 'p4-5', 'p4-6', 'p4-8'] },
  { id: 'ad-click-journey', name: 'The Journey of an Ad Click', criticality: 'must_know_cold', relatedNodes: ['p4-1', 'p4-2', 'p4-7', 'p5-2'] },
  { id: 'click-conversion', name: 'Click-to-Conversion Tracking Flow', criticality: 'must_know_cold', relatedNodes: ['p5-1', 'p5-2', 'p5-3', 'p5-6'] },
  { id: 'auction', name: 'How the Google Ads Auction Works', criticality: 'must_know_cold', relatedNodes: ['phase-3', 'p3-1', 'p3-2', 'p3-3'] },
  { id: 'http-status', name: 'HTTP Status Codes', criticality: 'must_know_cold', relatedNodes: ['p4-6'] },
  { id: 'security', name: 'Internet Security (AuthN, AuthZ, TLS)', criticality: 'must_know_cold', relatedNodes: ['p4-5', 'p4-11'] },
  { id: 'page-speed', name: 'How to Reduce Page Load Time', criticality: 'must_know_cold', relatedNodes: ['p4-8', 'p4-9', 'p4-10'] },
  { id: 'account-hierarchy', name: 'Google Ads Account Hierarchy', criticality: 'must_know_cold', relatedNodes: ['phase-1', 'p1-1', 'p1-2'] },
  { id: 'troubleshooting', name: 'The Troubleshooting Framework', criticality: 'must_know_cold', relatedNodes: ['p7-4'] },
  { id: 'bigquery', name: 'BigQuery - What It Is', criticality: 'must_know_cold', relatedNodes: ['phase-6', 'p6-1', 'p6-2'] },
  { id: 'sql-patterns', name: 'SQL Query Patterns for Ad Data', criticality: 'must_know_cold', relatedNodes: ['p6-3', 'p6-4'] },
  { id: 'cookies', name: 'Cookies in Ad Tracking', criticality: 'must_know_cold', relatedNodes: ['p4-7', 'p5-10'] },
  { id: 'gtm', name: 'GTM Architecture and DataLayer', criticality: 'must_know_cold', relatedNodes: ['p5-4', 'p5-5'] },
  { id: 'ads-ga4-mismatch', name: 'Why Google Ads and GA4 Numbers Don\'t Match', criticality: 'must_know_cold', relatedNodes: ['p5-9', 'p5-8'] },
  { id: 'competition', name: 'Competitive Landscape', criticality: 'know_well', relatedNodes: ['phase-8'] },
];

// Helper to collect all expandable node IDs
function collectAllIds(nodes: LifecycleNode[]): string[] {
  const ids: string[] = [];
  const traverse = (nodeList: LifecycleNode[]) => {
    for (const node of nodeList) {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return ids;
}

// Helper to find all matching node IDs for search
function findMatchingNodeIds(nodes: LifecycleNode[], query: string): string[] {
  const ids: string[] = [];
  const lowerQuery = query.toLowerCase();

  const traverse = (nodeList: LifecycleNode[], parentIds: string[]) => {
    for (const node of nodeList) {
      const searchableText = [
        node.name,
        node.definition,
        node.adsContext,
        node.tscRelevance,
        ...(node.keyDetails || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(lowerQuery)) {
        // Add this node and all its parents to expand
        ids.push(node.id, ...parentIds);
      }

      if (node.children) {
        traverse(node.children, [...parentIds, node.id]);
      }
    }
  };

  traverse(nodes, []);
  return [...new Set(ids)]; // Remove duplicates
}

export function Header() {
  const {
    priorityFilter, setPriorityFilter,
    searchQuery, setSearchQuery,
    setSidebarOpen, setSidebarTab,
    expandAll, collapseAll,
    setSelectedNodeId,
    selectedKeyProcess, setSelectedKeyProcess
  } = useStore();
  const data = lifecycleData as LifecycleData;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToPhase = (phaseNum: number) => {
    const phaseId = `phase-${phaseNum}`;
    const element = document.querySelector(`[data-id="${phaseId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  const openPanel = (tab: 'ecosystem' | 'competitors' | 'privacy') => {
    setSidebarTab(tab);
    setSidebarOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Auto-expand all matching nodes
      const matchingIds = findMatchingNodeIds(data.phases, searchQuery);
      if (matchingIds.length > 0) {
        expandAll(matchingIds);
      }
    }
  };

  const handleKeyProcessSelect = (process: typeof keyProcesses[0]) => {
    setSelectedKeyProcess(process.id);
    setDropdownOpen(false);
    // Expand related nodes
    expandAll(process.relatedNodes);
    // Scroll to first related node
    if (process.relatedNodes[0]) {
      setTimeout(() => {
        const element = document.querySelector(`[data-id="${process.relatedNodes[0]}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 100);
    }
  };

  const selectedProcess = keyProcesses.find(p => p.id === selectedKeyProcess);

  return (
    <header className="min-h-[64px] bg-white border-b flex flex-wrap items-center justify-between px-4 gap-2 sticky top-0 z-50">
      {/* Left section */}
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-base font-semibold text-gray-900 whitespace-nowrap">Google Ads Lifecycle</h1>

        {/* Phase pills - hidden on small screens */}
        <div className="hidden md:flex gap-1">
          {phases.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className="w-7 h-7 p-0 rounded-full text-xs font-medium hover:bg-blue-50 hover:border-blue-300"
              onClick={() => scrollToPhase(num)}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Expand/Collapse */}
        <div className="flex items-center gap-1 border-l pl-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => expandAll(collectAllIds(data.phases))}
            title="Expand All"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Expand</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => collapseAll()}
            title="Collapse All"
          >
            <Minimize2 className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Collapse</span>
          </Button>
        </div>

        {/* Key Processes Dropdown */}
        <div className="relative border-l pl-2">
          <Button
            variant={selectedProcess ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-7 px-2 text-xs gap-1",
              selectedProcess && "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0"
            )}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">{selectedProcess ? selectedProcess.name.slice(0, 20) + '...' : 'Key Processes'}</span>
            <span className="sm:hidden">Key</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
          </Button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border rounded-lg shadow-xl z-50 max-h-[70vh] overflow-auto">
                <div className="p-2 border-b bg-gray-50">
                  <p className="text-xs font-medium text-gray-500">15 Critical Interview Processes</p>
                </div>
                <div className="p-1">
                  {selectedProcess && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-xs text-gray-500 mb-1"
                      onClick={() => {
                        setSelectedKeyProcess(null);
                        setDropdownOpen(false);
                      }}
                    >
                      <X className="w-3 h-3 mr-2" />
                      Clear Selection
                    </Button>
                  )}
                  {keyProcesses.map((process, i) => (
                    <button
                      key={process.id}
                      onClick={() => handleKeyProcessSelect(process)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors flex items-start gap-2",
                        selectedKeyProcess === process.id && "bg-blue-100 border border-blue-200"
                      )}
                    >
                      <span className={cn(
                        "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        process.criticality === 'must_know_cold' ? 'bg-red-500' : 'bg-amber-500'
                      )}>
                        {i + 1}
                      </span>
                      <span className="flex-1">{process.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Panel Quick Access - hidden on small screens */}
        <div className="hidden lg:flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => openPanel('ecosystem')}
          >
            <Globe className="w-3 h-3 mr-1" />
            Ecosystem
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50"
            onClick={() => openPanel('competitors')}
          >
            <Swords className="w-3 h-3 mr-1" />
            Competitors
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => openPanel('privacy')}
          >
            <Shield className="w-3 h-3 mr-1" />
            Privacy
          </Button>
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value as typeof priorityFilter)}
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                priorityFilter === p.value
                  ? p.color
                    ? `${p.color} text-white`
                    : 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Search with clear button */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search... (Enter to expand)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-8 pr-8 w-48 sm:w-56 h-8 text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
