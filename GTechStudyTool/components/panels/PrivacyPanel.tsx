'use client';

import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PrivacyPanel() {
  const data = lifecycleData as LifecycleData;
  const privacyConcepts = data.crossCutting?.privacyConsent || [];

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-4 p-4 break-words">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Privacy & Consent</h3>
          <p className="text-xs text-gray-400">Regulations and privacy-preserving technologies</p>
        </div>
        {privacyConcepts.map((concept, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {concept.concept}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Definition</p>
                <p className="text-sm text-gray-600">{concept.definition}</p>
              </div>

              <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs font-medium text-purple-700 mb-0.5">Google Ads Context</p>
                <p className="text-sm text-purple-600">{concept.adsContext}</p>
              </div>

              {concept.affectedPhases && concept.affectedPhases.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Affected Phases</p>
                  <div className="flex flex-wrap gap-1">
                    {concept.affectedPhases.map((phase, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {phase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
