import { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { CourseTree } from './components/tree/CourseTree';
import { TiptapEditor } from './components/editor/TiptapEditor';
import { NodeTodoList } from './components/todos/NodeTodoList';
import { AISearchModal } from './components/ai/AISearchModal';
import { useTreeStore } from './store/useTreeStore';
import { apiService } from './services/api';
import { CourseNode } from './types';

export function App() {
  const { activeNodeId, activeCourseId } = useTreeStore();
  const [nodes, setNodes] = useState<CourseNode[]>([]);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);

  const loadTree = async () => {
    const data = await apiService.getCourseTree(activeCourseId);
    setNodes(data);
  };

  useEffect(() => {
    loadTree();
  }, [activeCourseId]);

  const activeNode = nodes.find((n) => n.id === activeNodeId) || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Header Bar */}
      <Header onOpenAISearch={() => setIsAISearchOpen(true)} />

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <CourseTree nodes={nodes} onRefresh={loadTree} />

        {/* AST Editor Section */}
        <TiptapEditor node={activeNode} onSaved={loadTree} />

        {/* Task Todo Section */}
        <NodeTodoList nodeId={activeNodeId} />
      </div>

      {/* AI Search RAG Dialog Modal */}
      <AISearchModal isOpen={isAISearchOpen} onClose={() => setIsAISearchOpen(false)} />
    </div>
  );
}

export default App;
