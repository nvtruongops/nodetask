import { create } from 'zustand';

interface TreeStoreState {
  activeNodeId: string | null;
  expandedNodeIds: Set<string>;
  isDarkTheme: boolean;
  activeWorkspaceId: string;
  activeCourseId: string; // Legacy alias
  setActiveNodeId: (id: string | null) => void;
  toggleExpandNode: (id: string) => void;
  toggleTheme: () => void;
  setActiveWorkspaceId: (id: string) => void;
  setActiveCourseId: (id: string) => void; // Legacy alias
}

export const useTreeStore = create<TreeStoreState>((set) => ({
  activeNodeId: 'node-topic-1',
  expandedNodeIds: new Set(['node-topic-1', 'node-module-1']),
  isDarkTheme: true,
  activeWorkspaceId: 'workspace-default-1',
  activeCourseId: 'workspace-default-1',

  setActiveNodeId: (id) => set({ activeNodeId: id }),

  toggleExpandNode: (id) =>
    set((state) => {
      const next = new Set(state.expandedNodeIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedNodeIds: next };
    }),

  toggleTheme: () =>
    set((state) => {
      const next = !state.isDarkTheme;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkTheme: next };
    }),

  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id, activeCourseId: id }),
  setActiveCourseId: (id) => set({ activeWorkspaceId: id, activeCourseId: id }),
}));
