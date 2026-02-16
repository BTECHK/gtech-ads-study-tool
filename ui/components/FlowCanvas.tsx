'use client';

import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PhaseNode } from './flow/PhaseNode';
import { useStore } from '@/lib/store';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData } from '@/lib/types';

const nodeTypes = {
  phase: PhaseNode,
};

export function FlowCanvas() {
  const { selectedNodeId, setSelectedNodeId, expandedNodeIds, toggleExpanded } = useStore();
  const data = lifecycleData as LifecycleData;

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    data.phases.forEach((phase, index) => {
      nodes.push({
        id: phase.id,
        type: 'phase',
        position: { x: index * 280, y: 100 },
        data: {
          name: phase.name,
          phaseNumber: phase.phaseNumber,
          priority: phase.priority,
          category: phase.category,
          childCount: phase.children?.length || 0,
          isExpanded: expandedNodeIds.has(phase.id),
          isSelected: selectedNodeId === phase.id,
          onSelect: () => setSelectedNodeId(phase.id),
          onToggleExpand: () => toggleExpanded(phase.id),
        },
      });

      if (index > 0) {
        edges.push({
          id: `e-${data.phases[index - 1].id}-${phase.id}`,
          source: data.phases[index - 1].id,
          target: phase.id,
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      }
    });

    return { nodes, edges };
  }, [data.phases, expandedNodeIds, selectedNodeId, setSelectedNodeId, toggleExpanded]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Sync nodes when dependencies change
  useEffect(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges, setFlowNodes, setFlowEdges]);

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        className="bg-gray-50"
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
