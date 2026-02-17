'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityStyles = {
  must_know_cold: 'border-red-500 border-[3px] bg-gradient-to-br from-white to-red-50',
  know_well: 'border-amber-500 border-2 bg-gradient-to-br from-white to-amber-50',
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
  name: string;
  phaseNumber?: number;
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

export const PhaseNode = memo(({ data }: NodeProps<PhaseNodeData>) => {
  const priorityStyle = priorityStyles[data.priority as keyof typeof priorityStyles] || priorityStyles.conceptual_awareness;
  const categoryColor = categoryColors[data.category] || 'bg-gray-500';

  return (
    <div
      className={cn(
        'w-[200px] min-h-[120px] rounded-xl p-4 cursor-pointer transition-all shadow-md',
        'hover:shadow-lg hover:-translate-y-0.5',
        priorityStyle,
        data.isSelected && 'ring-4 ring-blue-500 ring-offset-2 shadow-xl shadow-blue-500/30',
        data.isDimmed && 'opacity-20 pointer-events-none'
      )}
      onClick={data.onSelect}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2" />

      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Phase {data.phaseNumber}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onOpenDetail();
            }}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
            title="View details"
          >
            <Info className="w-4 h-4 text-blue-600" />
          </button>
          {data.childCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onToggleExpand();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={data.isExpanded ? 'Collapse' : 'Expand'}
            >
              {data.isExpanded
                ? <ChevronDown className="w-5 h-5 text-gray-600" />
                : <ChevronRight className="w-5 h-5 text-gray-600" />
              }
            </button>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 text-[15px] leading-tight mb-3">
        {data.name}
      </h3>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={cn('text-white text-[10px] px-2', categoryColor)}>
          {data.category.replace(/_/g, ' ')}
        </Badge>
        {data.childCount > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {data.childCount} items
          </Badge>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="!bg-gray-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
});

PhaseNode.displayName = 'PhaseNode';
