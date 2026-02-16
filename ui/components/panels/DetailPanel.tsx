'use client';

import { useStore } from '@/lib/store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData, LifecycleNode } from '@/lib/types';

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

export function DetailPanel() {
  const { selectedNodeId, sidebarOpen, setSidebarOpen } = useStore();
  const data = lifecycleData as LifecycleData;

  const selectedNode = selectedNodeId ? findNodeById(data.phases, selectedNodeId) : null;

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
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

            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-4 pb-4">
                <TabsContent value="overview" className="space-y-4 mt-4">
                  {selectedNode.definition && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Definition</h4>
                      <p className="text-sm text-gray-600">{selectedNode.definition}</p>
                    </div>
                  )}
                  {selectedNode.adsContext && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-700 mb-1">Google Ads Context</h4>
                      <p className="text-sm text-blue-600">{selectedNode.adsContext}</p>
                    </div>
                  )}
                  {selectedNode.tscRelevance && (
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-amber-700 mb-1">TSC Relevance</h4>
                      <p className="text-sm text-amber-600">{selectedNode.tscRelevance}</p>
                    </div>
                  )}
                  {selectedNode.summary && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Summary</h4>
                      <p className="text-sm text-gray-600">{selectedNode.summary}</p>
                    </div>
                  )}
                  {selectedNode.dataFlowIn && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-green-700 mb-1">Data Flow In</h4>
                      <p className="text-sm text-green-600">{selectedNode.dataFlowIn}</p>
                    </div>
                  )}
                  {selectedNode.dataFlowOut && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-purple-700 mb-1">Data Flow Out</h4>
                      <p className="text-sm text-purple-600">{selectedNode.dataFlowOut}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="technical" className="space-y-4 mt-4">
                  {selectedNode.keyDetails && selectedNode.keyDetails.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Details</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedNode.keyDetails.map((detail, i) => (
                          <li key={i} className="text-sm text-gray-600">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedNode.sqlConnection && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-purple-700 mb-1">SQL Connection</h4>
                      <pre className="text-xs text-purple-600 whitespace-pre-wrap font-mono">{selectedNode.sqlConnection}</pre>
                    </div>
                  )}
                  {selectedNode.tools && selectedNode.tools.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.tools.map((tool, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="troubleshooting" className="space-y-4 mt-4">
                  {selectedNode.troubleshooting ? (
                    <>
                      {selectedNode.troubleshooting.symptoms && selectedNode.troubleshooting.symptoms.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Symptoms</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedNode.troubleshooting.symptoms.map((s, i) => (
                              <li key={i} className="text-sm text-gray-600">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedNode.troubleshooting.diagnosticQuestions && selectedNode.troubleshooting.diagnosticQuestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Diagnostic Questions</h4>
                          <ol className="list-decimal list-inside space-y-1">
                            {selectedNode.troubleshooting.diagnosticQuestions.map((q, i) => (
                              <li key={i} className="text-sm text-gray-600">{q}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {selectedNode.troubleshooting.causes && selectedNode.troubleshooting.causes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Common Causes</h4>
                          <div className="space-y-3">
                            {selectedNode.troubleshooting.causes.map((cause, i) => (
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
                  {selectedNode.interviewQuestions && selectedNode.interviewQuestions.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Interview Questions</h4>
                      <ul className="space-y-3">
                        {selectedNode.interviewQuestions.map((q, i) => (
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a node to view details
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
