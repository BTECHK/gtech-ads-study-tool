'use client';

import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CompetitorPanel() {
  const data = lifecycleData as LifecycleData;
  const competitors = data.crossCutting?.competitors || [];

  // Filter out Google itself from competitors (it's the baseline)
  const actualCompetitors = competitors.filter(c => c.name !== 'Google');

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-4 p-4 break-words">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Competitive Landscape</h3>
          <p className="text-xs text-gray-400">Key competitors and Google&apos;s positioning</p>
        </div>
        {actualCompetitors.map((comp, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {comp.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comp.coreProducts && comp.coreProducts.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Core Products</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.coreProducts.map((product, j) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs font-medium text-blue-700 mb-0.5">Core Strength</p>
                <p className="text-sm text-blue-600">{comp.coreStrength}</p>
              </div>

              <div className="bg-red-50 p-2 rounded">
                <p className="text-xs font-medium text-red-700 mb-0.5">Threat to Google</p>
                <p className="text-sm text-red-600">{comp.threatToGoogle}</p>
              </div>

              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs font-medium text-green-700 mb-0.5">Google&apos;s Response</p>
                <p className="text-sm text-green-600">{comp.googleResponse}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
