'use client';

import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function EcosystemPanel() {
  const data = lifecycleData as LifecycleData;
  const products = data.crossCutting?.googleEcosystem || [];

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-4 p-4 break-words">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Google Ecosystem</h3>
          <p className="text-xs text-gray-400">Products that integrate with Google Ads</p>
        </div>
        {products.map((product, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {product.product}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Phases Involved</p>
                <div className="flex flex-wrap gap-1">
                  {product.phasesInvolved?.map((phase, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">
                      {phase}
                    </Badge>
                  ))}
                </div>
              </div>

              {product.dataSent && (
                <div className="bg-green-50 p-2 rounded mb-2">
                  <p className="text-xs font-medium text-green-700 mb-0.5">Data Sent</p>
                  <p className="text-xs text-green-600">{product.dataSent}</p>
                </div>
              )}

              {product.dataReceived && (
                <div className="bg-blue-50 p-2 rounded mb-2">
                  <p className="text-xs font-medium text-blue-700 mb-0.5">Data Received</p>
                  <p className="text-xs text-blue-600">{product.dataReceived}</p>
                </div>
              )}

              {product.commonTscIssues && product.commonTscIssues.length > 0 && (
                <div className="bg-red-50 p-2 rounded">
                  <p className="text-xs font-medium text-red-700 mb-1">Common TSC Issues</p>
                  <ul className="text-xs text-red-600 list-disc pl-4 space-y-0.5">
                    {product.commonTscIssues.slice(0, 5).map((issue, j) => (
                      <li key={j} className="break-words">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
