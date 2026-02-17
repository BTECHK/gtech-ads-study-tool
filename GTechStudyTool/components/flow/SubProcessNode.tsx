'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityStyles = {
  must_know_cold: 'border-red-500 border-2 bg-gradient-to-br from-white to-red-50',
  know_well: 'border-amber-500 border bg-gradient-to-br from-white to-amber-50',
  conceptual_awareness: 'border-blue-400 border bg-gradient-to-br from-white to-blue-50',
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
  account_structure: 'bg-indigo-600',
  campaign_management: 'bg-pink-600',
  campaign_types: 'bg-rose-500',
  strategy: 'bg-violet-600',
  bidding: 'bg-emerald-600',
  targeting: 'bg-cyan-600',
  audience: 'bg-sky-600',
  creatives: 'bg-fuchsia-600',
  tracking: 'bg-lime-600',
  measurement: 'bg-amber-600',
  attribution: 'bg-yellow-600',
  optimization_strategy: 'bg-teal-500',
  troubleshooting: 'bg-red-700',
  keyword_optimization: 'bg-blue-700',
  conversion_optimization: 'bg-green-700',
  reporting: 'bg-purple-700',
  campaign_type: 'bg-rose-600',
  competitive_intelligence: 'bg-slate-600',
};

interface SubProcessNodeData {
  name: string;
  priority: string;
  category: string;
  childCount: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDimmed?: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onOpenDetail: () => void;
}

export const SubProcessNode = memo(({ data }: NodeProps<SubProcessNodeData>) => {
  const priorityStyle = priorityStyles[data.priority as keyof typeof priorityStyles] || priorityStyles.conceptual_awareness;
  const categoryColor = categoryColors[data.category] || 'bg-gray-500';

  return (
    <div
      className={cn(
        'w-[160px] min-h-[80px] rounded-lg p-3 cursor-pointer transition-all shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5',
        priorityStyle,
        data.isSelected && 'ring-4 ring-blue-500 ring-offset-1 shadow-lg shadow-blue-500/30',
        data.isDimmed && 'opacity-20 pointer-events-none'
      )}
      onClick={data.onSelect}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-1.5 !h-1.5" />

      <div className="flex justify-between items-start mb-1">
        <Badge className={cn('text-white text-[9px] px-1.5', categoryColor)}>
          {data.category.replace(/_/g, ' ')}
        </Badge>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onOpenDetail();
            }}
            className="p-0.5 hover:bg-blue-100 rounded transition-colors"
            title="View details"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
          </button>
          {data.childCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onToggleExpand();
              }}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              title={data.isExpanded ? 'Collapse' : 'Expand'}
            >
              {data.isExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-600" />
                : <ChevronRight className="w-4 h-4 text-gray-600" />
              }
            </button>
          )}
        </div>
      </div>

      <h4 className="font-medium text-gray-900 text-[13px] leading-tight mt-2">
        {data.name}
      </h4>

      {data.childCount > 0 && (
        <span className="text-[10px] text-gray-500 mt-1 block">
          {data.childCount} sub-items
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-1.5 !h-1.5" />
    </div>
  );
});

SubProcessNode.displayName = 'SubProcessNode';
