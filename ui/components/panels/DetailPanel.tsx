'use client';

import { useStore } from '@/lib/store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { EcosystemPanel } from './EcosystemPanel';
import { CompetitorPanel } from './CompetitorPanel';
import { PrivacyPanel } from './PrivacyPanel';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData, LifecycleNode } from '@/lib/types';
import { Globe, Swords, Shield, FileText, X } from 'lucide-react';

function findNodeById(nodes: LifecycleNode[], id: string): LifecycleNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

const priorityColors: Record<string, string> = {
  must_know_cold: 'bg-red-500',
  know_well: 'bg-amber-500',
  conceptual_awareness: 'bg-blue-500',
};

function NodeDetailContent({ node }: { node: LifecycleNode }) {
  return (
    <Tabs defaultValue="overview" className="flex-1 flex flex-col">
      <TabsList className="mx-4 mt-4 grid grid-cols-4">
        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
        <TabsTrigger value="technical" className="text-xs">Technical</TabsTrigger>
        <TabsTrigger value="troubleshooting" className="text-xs">Issues</TabsTrigger>
        <TabsTrigger value="interview" className="text-xs">Interview</TabsTrigger>
      </TabsList>

      <ScrollArea className="flex-1 px-4 pb-4">
        <TabsContent value="overview" className="space-y-4 mt-4">
          {node.definition && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Definition</h4>
              <p className="text-sm text-gray-600">{node.definition}</p>
            </div>
          )}
          {node.adsContext && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-700 mb-1">Google Ads Context</h4>
              <p className="text-sm text-blue-600">{node.adsContext}</p>
            </div>
          )}
          {node.tscRelevance && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-amber-700 mb-1">TSC Relevance</h4>
              <p className="text-sm text-amber-600">{node.tscRelevance}</p>
            </div>
          )}
          {node.summary && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Summary</h4>
              <p className="text-sm text-gray-600">{node.summary}</p>
            </div>
          )}
          {node.dataFlowIn && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-green-700 mb-1">Data Flow In</h4>
              <p className="text-sm text-green-600">{node.dataFlowIn}</p>
            </div>
          )}
          {node.dataFlowOut && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-purple-700 mb-1">Data Flow Out</h4>
              <p className="text-sm text-purple-600">{node.dataFlowOut}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4 mt-4">
          {node.keyDetails && node.keyDetails.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Details</h4>
              <ul className="list-disc list-inside space-y-1">
                {node.keyDetails.map((detail, i) => (
                  <li key={i} className="text-sm text-gray-600">{detail}</li>
                ))}
              </ul>
            </div>
          )}
          {node.sqlConnection && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-purple-700 mb-1">SQL Connection</h4>
              <pre className="text-xs text-purple-600 whitespace-pre-wrap font-mono">{node.sqlConnection}</pre>
            </div>
          )}
          {node.tools && node.tools.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Tools</h4>
              <div className="flex flex-wrap gap-2">
                {node.tools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-4 mt-4">
          {node.troubleshooting ? (
            <>
              {node.troubleshooting.symptoms && node.troubleshooting.symptoms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Symptoms</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {node.troubleshooting.symptoms.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {node.troubleshooting.diagnosticQuestions && node.troubleshooting.diagnosticQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Diagnostic Questions</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {node.troubleshooting.diagnosticQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-gray-600">{q}</li>
                    ))}
                  </ol>
                </div>
              )}
              {node.troubleshooting.causes && node.troubleshooting.causes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Common Causes</h4>
                  <div className="space-y-3">
                    {node.troubleshooting.causes.map((cause, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-800">{cause.issue}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              cause.probability === 'high'
                                ? 'border-red-300 text-red-600'
                                : cause.probability === 'medium'
                                ? 'border-amber-300 text-amber-600'
                                : 'border-blue-300 text-blue-600'
                            }`}
                          >
                            {cause.probability}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1"><strong>Resolution:</strong> {cause.resolution}</p>
                        <p className="text-xs text-gray-500"><strong>Verify:</strong> {cause.verification}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No troubleshooting information available for this node.
            </div>
          )}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4 mt-4">
          {node.interviewQuestions && node.interviewQuestions.length > 0 ? (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Interview Questions</h4>
              <ul className="space-y-3">
                {node.interviewQuestions.map((q, i) => (
                  <li key={i} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    <span className="font-medium text-blue-600 mr-2">Q{i + 1}:</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No interview questions available for this node.
            </div>
          )}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}

export function DetailPanel() {
  const { selectedNodeId, sidebarOpen, setSidebarOpen, sidebarTab, setSidebarTab } = useStore();
  const data = lifecycleData as LifecycleData;

  const selectedNode = selectedNodeId ? findNodeById(data.phases, selectedNodeId) : null;

  const panelTabs = [
    { id: 'detail' as const, label: 'Node Detail', icon: FileText },
    { id: 'ecosystem' as const, label: 'Ecosystem', icon: Globe },
    { id: 'competitors' as const, label: 'Competitors', icon: Swords },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
  ];

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent className="w-[450px] sm:w-[550px] p-0 flex flex-col">
        {/* Panel Navigation */}
        <div className="border-b px-2 py-2 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {panelTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = sidebarTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-8 px-3 text-xs ${
                      isActive ? '' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarTab(tab.id)}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Panel Content */}
        {sidebarTab === 'detail' && (
          <>
            {selectedNode ? (
              <>
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={`${priorityColors[selectedNode.priority] || 'bg-gray-500'} text-white text-xs`}
                    >
                      {selectedNode.priority?.replace(/_/g, ' ')}
                    </Badge>
                    {selectedNode.phaseNumber && (
                      <Badge variant="outline" className="text-xs">
                        Phase {selectedNode.phaseNumber}
                      </Badge>
                    )}
                  </div>
                  <SheetTitle className="text-xl text-left">{selectedNode.name}</SheetTitle>
                </SheetHeader>
                <NodeDetailContent node={selectedNode} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-2 p-8">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-center">Select a node from the flow diagram to view its details</p>
                <p className="text-xs text-gray-400 text-center">Or use the tabs above to explore the Google ecosystem, competitors, and privacy concepts</p>
              </div>
            )}
          </>
        )}

        {sidebarTab === 'ecosystem' && <EcosystemPanel />}
        {sidebarTab === 'competitors' && <CompetitorPanel />}
        {sidebarTab === 'privacy' && <PrivacyPanel />}
      </SheetContent>
    </Sheet>
  );
}
