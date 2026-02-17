import { create } from 'zustand';
import { Priority, Category, LifecycleNode } from './types';

interface StoreState {
  // Selection
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Expansion
  expandedNodeIds: Set<string>;
  toggleExpanded: (id: string) => void;
  expandAll: (allIds: string[]) => void;
  addToExpanded: (ids: string[]) => void;
  collapseAll: () => void;

  // Filters
  priorityFilter: Priority | 'all';
  setPriorityFilter: (filter: Priority | 'all') => void;
  categoryFilter: Category | 'all';
  setCategoryFilter: (filter: Category | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarTab: 'detail' | 'ecosystem' | 'competitors' | 'privacy';
  setSidebarTab: (tab: 'detail' | 'ecosystem' | 'competitors' | 'privacy') => void;

  // Key Processes
  selectedKeyProcess: string | null;
  setSelectedKeyProcess: (id: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  expandedNodeIds: new Set<string>(),
  toggleExpanded: (id) => set((state) => {
    const newSet = new Set(state.expandedNodeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return { expandedNodeIds: newSet };
  }),
  expandAll: (allIds) => set({ expandedNodeIds: new Set(allIds) }),
  addToExpanded: (ids) => set((state) => {
    const newSet = new Set(state.expandedNodeIds);
    ids.forEach(id => newSet.add(id));
    return { expandedNodeIds: newSet };
  }),
  collapseAll: () => set({ expandedNodeIds: new Set() }),

  priorityFilter: 'all',
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),
  categoryFilter: 'all',
  setCategoryFilter: (filter) => set({ categoryFilter: filter }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sidebarTab: 'detail',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  selectedKeyProcess: null,
  setSelectedKeyProcess: (id) => set({ selectedKeyProcess: id }),
}));
