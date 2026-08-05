import { create } from 'zustand';
import { CourseNode } from '../types';

interface TreeStoreState {
  activeNodeId: string | null;
  expandedNodeIds: Set<string>;
  isDarkTheme: boolean;
  activeCourseId: string;
  setActiveNodeId: (id: string | null) => void;
  toggleExpandNode: (id: string) => void;
  toggleTheme: () => void;
  setActiveCourseId: (id: string) => void;
}

export const useTreeStore = create<TreeStoreState>((set) => ({
  activeNodeId: 'node-topic-1',
  expandedNodeIds: new Set(['node-topic-1', 'node-module-1']),
  isDarkTheme: true,
  activeCourseId: 'course-default-1',

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

  setActiveCourseId: (id) => set({ activeCourseId: id }),
}));
