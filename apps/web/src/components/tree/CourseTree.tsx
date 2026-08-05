import React, { useState } from 'react';
import { CourseNode } from '../../types';
import { useTreeStore } from '../../store/useTreeStore';
import { apiService } from '../../services/api';

interface CourseTreeProps {
  nodes: CourseNode[];
  onRefresh: () => void;
}

export const CourseTree: React.FC<CourseTreeProps> = ({ nodes, onRefresh }) => {
  const { activeNodeId, setActiveNodeId, expandedNodeIds, toggleExpandNode, activeCourseId } = useTreeStore();
  const [newTitle, setNewTitle] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Group nodes by parent
  const rootNodes = nodes.filter((n) => !n.parentId);

  const getChildren = (parentId: string) => {
    return nodes.filter((n) => n.parentId === parentId);
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await apiService.createNode({
      courseId: activeCourseId,
      parentId: selectedParentId,
      title: newTitle,
      nodeType: selectedParentId ? 'MODULE' : 'TOPIC',
    });

    setNewTitle('');
    setShowAddForm(false);
    onRefresh();
  };

  const handleDeleteNode = async (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete node and all descendants?')) {
      await apiService.deleteNode(nodeId);
      if (activeNodeId === nodeId) {
        setActiveNodeId(null);
      }
      onRefresh();
    }
  };

  const renderNode = (node: CourseNode, depth: number = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isActive = activeNodeId === node.id;

    return (
      <div key={node.id} className="select-none font-mono text-xs">
        {/* Node Item Container */}
        <div
          onClick={() => setActiveNodeId(node.id)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`group flex items-center justify-between py-1.5 px-2 border-l-2 cursor-pointer transition-colors ${
            isActive
              ? 'border-foreground bg-secondary font-semibold text-foreground'
              : 'border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            {/* Collapse/Expand Toggle Bracket */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandNode(node.id);
                }}
                className="w-4 text-center font-bold text-foreground hover:bg-border rounded"
              >
                {isExpanded ? '[-]' : '[+]'}
              </button>
            ) : (
              <span className="w-4 text-center text-muted-foreground font-normal">--</span>
            )}

            {/* Type Tag Bracket */}
            <span className="text-[10px] uppercase opacity-75 font-semibold">
              [{node.nodeType}]
            </span>

            {/* Node Title */}
            <span className="truncate">{node.title}</span>
          </div>

          {/* Inline Action Buttons */}
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedParentId(node.id);
                setShowAddForm(true);
              }}
              className="px-1 py-0.5 border border-border hover:bg-foreground hover:text-background rounded text-[10px]"
            >
              [+SUB]
            </button>
            <button
              onClick={(e) => handleDeleteNode(node.id, e)}
              className="px-1 py-0.5 border border-border hover:bg-foreground hover:text-background rounded text-[10px]"
            >
              [DEL]
            </button>
          </div>
        </div>

        {/* Child Subtree */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-80 min-w-[280px]">
      {/* Tree Section Header */}
      <div className="p-3 border-b border-border flex items-center justify-between font-mono text-xs select-none">
        <span className="font-bold uppercase tracking-wider">[COURSE NAVIGATION]</span>
        <button
          onClick={() => {
            setSelectedParentId(null);
            setShowAddForm(true);
          }}
          className="px-2 py-0.5 border border-border hover:bg-foreground hover:text-background transition-colors rounded"
        >
          [+ TOPIC]
        </button>
      </div>

      {/* Add Node Form Dialog */}
      {showAddForm && (
        <form onSubmit={handleAddNode} className="p-3 border-b border-border bg-muted/40 font-mono text-xs">
          <div className="mb-2 text-[10px] text-muted-foreground uppercase">
            {selectedParentId ? '[ADDING CHILD NODE]' : '[ADDING TOPIC NODE]'}
          </div>
          <input
            type="text"
            placeholder="Node Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="w-full bg-background border border-border px-2 py-1 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2 py-0.5 border border-border hover:bg-muted rounded"
            >
              [CANCEL]
            </button>
            <button
              type="submit"
              className="px-2 py-0.5 border border-foreground bg-primary text-primary-foreground rounded"
            >
              [SAVE]
            </button>
          </div>
        </form>
      )}

      {/* Node Tree List */}
      <div className="flex-1 overflow-y-auto py-2">
        {rootNodes.length === 0 ? (
          <div className="p-4 text-center font-mono text-xs text-muted-foreground">
            [NO NODES FOUND]
          </div>
        ) : (
          rootNodes.map((rootNode) => renderNode(rootNode, 0))
        )}
      </div>
    </div>
  );
};
