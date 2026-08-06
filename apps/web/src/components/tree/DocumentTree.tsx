import React, { useState } from 'react';
import { DocumentNode } from '../../types';
import { useTreeStore } from '../../store/useTreeStore';
import { apiService } from '../../services/api';

interface DocumentTreeProps {
  nodes: DocumentNode[];
  onRefresh: () => void;
}

export const DocumentTree: React.FC<DocumentTreeProps> = ({ nodes, onRefresh }) => {
  const { activeNodeId, setActiveNodeId, expandedNodeIds, toggleExpandNode, activeWorkspaceId } = useTreeStore();
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
      workspaceId: activeWorkspaceId,
      parentId: selectedParentId,
      title: newTitle,
      nodeType: selectedParentId ? 'DOCUMENT' : 'FOLDER',
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

  const renderNode = (node: DocumentNode, depth: number = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isActive = activeNodeId === node.id;

    return (
      <div key={node.id} className="select-none font-mono text-xs">
        {/* Node Item Container */}
        <div
          onClick={() => setActiveNodeId(node.id)}
          className={`flex items-center justify-between py-1.5 px-2 cursor-pointer transition-colors border-b border-border/40 ${
            isActive
              ? 'bg-primary text-primary-foreground font-bold'
              : 'hover:bg-accent text-foreground'
          }`}
          style={{ paddingLeft: `${Math.max(0.5, depth * 1.25)}rem` }}
        >
          <div className="flex items-center space-x-1.5 truncate">
            {/* Zero-Icon Text Indicator */}
            {hasChildren ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandNode(node.id);
                }}
                className="w-4 text-center select-none font-mono text-xs opacity-70 hover:opacity-100"
              >
                {isExpanded ? '[-]' : '[+]'}
              </span>
            ) : (
              <span className="w-4 text-center font-mono text-xs opacity-30">·</span>
            )}

            <span className="truncate">{node.title}</span>
          </div>

          {/* Action Bracket Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedParentId(node.id);
                setShowAddForm(true);
              }}
              className="px-1 text-[10px] uppercase tracking-wider border border-border hover:border-foreground"
            >
              [+Child]
            </button>
            <button
              onClick={(e) => handleDeleteNode(node.id, e)}
              className="px-1 text-[10px] uppercase tracking-wider border border-border hover:border-destructive text-destructive"
            >
              [Del]
            </button>
          </div>
        </div>

        {/* Child Nodes */}
        {hasChildren && isExpanded && (
          <div className="border-l border-border/30 ml-2">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground border-r border-border font-mono">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/20">
        <span className="text-xs font-bold uppercase tracking-widest">[Document Tree]</span>
        <button
          onClick={() => {
            setSelectedParentId(null);
            setShowAddForm(true);
          }}
          className="px-2 py-1 text-xs border border-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
        >
          [+ Top Node]
        </button>
      </div>

      {/* Quick Add Form Modal/Inline */}
      {showAddForm && (
        <form onSubmit={handleAddNode} className="p-3 border-b border-border bg-accent/40 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Add {selectedParentId ? 'Child Node' : 'Top Level Node'}
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Node Title..."
            autoFocus
            className="w-full px-2 py-1 text-xs border border-border bg-background text-foreground focus:outline-none focus:border-foreground font-mono"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2 py-0.5 text-xs border border-border hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2 py-0.5 text-xs border border-foreground bg-foreground text-background font-bold"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Tree Node List */}
      <div className="flex-1 overflow-y-auto">
        {rootNodes.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No document nodes yet. Click [+ Top Node] to start.
          </div>
        ) : (
          rootNodes.map((node) => renderNode(node, 0))
        )}
      </div>
    </div>
  );
};
