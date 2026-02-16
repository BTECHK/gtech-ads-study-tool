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
import { SubProcessNode } from './flow/SubProcessNode';
import { useStore } from '@/lib/store';
import lifecycleData from '@/data/lifecycle_data.json';
import { LifecycleData, LifecycleNode, Priority } from '@/lib/types';

const nodeTypes = {
  phase: PhaseNode,
  subprocess: SubProcessNode,
};

// Helper to check if a node matches the current filters
function nodeMatchesFilters(
  node: LifecycleNode,
  priorityFilter: Priority | 'all',
  searchQuery: string
): boolean {
  // Priority filter
  if (priorityFilter !== 'all' && node.priority !== priorityFilter) {
    return false;
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
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

    if (!searchableText.includes(query)) {
      return false;
    }
  }

  return true;
}

// Recursively check if any child matches filters
function anyChildMatchesFilters(
  node: LifecycleNode,
  priorityFilter: Priority | 'all',
  searchQuery: string
): boolean {
  if (nodeMatchesFilters(node, priorityFilter, searchQuery)) return true;
  if (node.children) {
    return node.children.some((child) =>
      anyChildMatchesFilters(child, priorityFilter, searchQuery)
    );
  }
  return false;
}

export function FlowCanvas() {
  const {
    selectedNodeId,
    setSelectedNodeId,
    expandedNodeIds,
    toggleExpanded,
    priorityFilter,
    searchQuery,
    selectedKeyProcess,
    setSidebarOpen,
  } = useStore();
  const data = lifecycleData as LifecycleData;

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const PHASE_WIDTH = 240;
    const PHASE_HEIGHT = 150;
    const CHILD_WIDTH = 200;
    const CHILD_HEIGHT = 110;
    const HORIZONTAL_GAP = 100;
    const VERTICAL_GAP = 50;
    const CHILD_START_Y = PHASE_HEIGHT + 100;
    const CHILD_HORIZONTAL_GAP = 40;

    // Track max children per phase for layout
    let currentX = 0;

    data.phases.forEach((phase, phaseIndex) => {
      const isExpanded = expandedNodeIds.has(phase.id);
      const matches = anyChildMatchesFilters(phase, priorityFilter, searchQuery);
      const directlyMatches = nodeMatchesFilters(phase, priorityFilter, searchQuery);

      nodes.push({
        id: phase.id,
        type: 'phase',
        position: { x: currentX, y: 100 },
        data: {
          name: phase.name,
          phaseNumber: phase.phaseNumber,
          priority: phase.priority,
          category: phase.category,
          childCount: phase.children?.length || 0,
          isExpanded,
          isSelected: selectedNodeId === phase.id,
          isDimmed: !matches,
          onSelect: () => setSelectedNodeId(phase.id),
          onToggleExpand: () => toggleExpanded(phase.id),
        },
      });

      // Connect to previous phase
      if (phaseIndex > 0) {
        edges.push({
          id: `e-${data.phases[phaseIndex - 1].id}-${phase.id}`,
          source: data.phases[phaseIndex - 1].id,
          target: phase.id,
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      }

      // Add children if expanded
      if (isExpanded && phase.children) {
        const childrenPerRow = 2;
        phase.children.forEach((child, childIndex) => {
          const row = Math.floor(childIndex / childrenPerRow);
          const col = childIndex % childrenPerRow;

          const childX = currentX + col * (CHILD_WIDTH + CHILD_HORIZONTAL_GAP);
          const childY = CHILD_START_Y + row * (CHILD_HEIGHT + VERTICAL_GAP);

          const childMatches = anyChildMatchesFilters(child, priorityFilter, searchQuery);

          nodes.push({
            id: child.id,
            type: 'subprocess',
            position: { x: childX, y: childY },
            data: {
              name: child.name,
              priority: child.priority,
              category: child.category,
              childCount: child.children?.length || 0,
              isExpanded: expandedNodeIds.has(child.id),
              isSelected: selectedNodeId === child.id,
              isDimmed: !childMatches,
              onSelect: () => setSelectedNodeId(child.id),
              onToggleExpand: () => toggleExpanded(child.id),
            },
          });

          // Edge from phase to child
          edges.push({
            id: `e-${phase.id}-${child.id}`,
            source: phase.id,
            target: child.id,
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 1 },
            animated: false,
          });

          // If this child is expanded, add its grandchildren
          if (expandedNodeIds.has(child.id) && child.children) {
            child.children.forEach((grandchild, gcIndex) => {
              const gcX = childX + CHILD_WIDTH + 40;
              const gcY = childY + gcIndex * (CHILD_HEIGHT - 20);

              const gcMatches = nodeMatchesFilters(grandchild, priorityFilter, searchQuery);

              nodes.push({
                id: grandchild.id,
                type: 'subprocess',
                position: { x: gcX, y: gcY },
                data: {
                  name: grandchild.name,
                  priority: grandchild.priority,
                  category: grandchild.category,
                  childCount: grandchild.children?.length || 0,
                  isExpanded: false,
                  isSelected: selectedNodeId === grandchild.id,
                  isDimmed: !gcMatches,
                  onSelect: () => setSelectedNodeId(grandchild.id),
                  onToggleExpand: () => {},
                },
              });

              edges.push({
                id: `e-${child.id}-${grandchild.id}`,
                source: child.id,
                target: grandchild.id,
                type: 'smoothstep',
                style: { stroke: '#cbd5e1', strokeWidth: 1 },
              });
            });
          }
        });
      }

      // Calculate width for this phase column with proper spacing
      const expandedChildWidth = isExpanded && phase.children && phase.children.length > 0
        ? Math.max(PHASE_WIDTH, 2 * (CHILD_WIDTH + CHILD_HORIZONTAL_GAP) + 60)
        : PHASE_WIDTH;
      currentX += expandedChildWidth + HORIZONTAL_GAP;
    });

    return { nodes, edges };
  }, [
    data.phases,
    expandedNodeIds,
    selectedNodeId,
    setSelectedNodeId,
    toggleExpanded,
    priorityFilter,
    searchQuery,
  ]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Sync nodes when dependencies change
  useEffect(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges, setFlowNodes, setFlowEdges]);

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        className="bg-gray-50"
        defaultViewport={{ x: 50, y: 50, zoom: 0.8 }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls className="!left-4 !bottom-4" />
        <MiniMap
          className="!right-4 !bottom-4 !w-40 !h-24"
          nodeColor={(node) => {
            if (node.data?.isDimmed) return '#e5e7eb';
            if (node.data?.priority === 'must_know_cold') return '#ef4444';
            if (node.data?.priority === 'know_well') return '#f59e0b';
            return '#3b82f6';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
