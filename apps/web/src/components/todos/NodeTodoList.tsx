import React, { useEffect, useState } from 'react';
import { NodeTodo } from '../../types';
import { apiService } from '../../services/api';

interface NodeTodoListProps {
  nodeId: string | null;
}

export const NodeTodoList: React.FC<NodeTodoListProps> = ({ nodeId }) => {
  const [todos, setTodos] = useState<NodeTodo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const fetchTodos = async () => {
    if (!nodeId) {
      setTodos([]);
      return;
    }
    const data = await apiService.getTodos(nodeId);
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, [nodeId]);

  const handleToggle = async (todoId: string) => {
    if (!nodeId) return;
    await apiService.toggleTodo(nodeId, todoId);
    fetchTodos();
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeId || !newTitle.trim()) return;
    await apiService.addTodo(nodeId, newTitle);
    setNewTitle('');
    fetchTodos();
  };

  if (!nodeId) {
    return null;
  }

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="w-80 border-l border-border bg-background p-4 flex flex-col h-full font-mono text-xs select-none">
      {/* Panel Header */}
      <div className="border-b border-border pb-3 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold uppercase tracking-wider">[NODE TASKS]</span>
          <span className="text-[10px] border border-border px-1.5 py-0.5 rounded bg-muted">
            {completedCount}/{todos.length} ({progressPercent}%)
          </span>
        </div>
        {/* Progress Bar (Monochrome High Contrast) */}
        <div className="w-full bg-muted h-1.5 rounded overflow-hidden mt-2">
          <div
            className="bg-foreground h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="New Task Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-background border border-border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-foreground text-xs"
          />
          <button
            type="submit"
            className="px-2.5 py-1 border border-foreground bg-primary text-primary-foreground font-bold rounded"
          >
            [+]
          </button>
        </div>
      </form>

      {/* Todo Items List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 border border-dashed border-border rounded">
            [NO TASKS ADDED]
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => handleToggle(todo.id)}
              className={`p-2.5 border rounded cursor-pointer transition-colors flex items-start justify-between ${
                todo.isCompleted
                  ? 'border-border bg-muted/30 text-muted-foreground line-through'
                  : 'border-border hover:bg-muted text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold font-mono">
                  {todo.isCompleted ? '[x]' : '[ ]'}
                </span>
                <span className="truncate">{todo.title}</span>
              </div>

              {todo.priority && (
                <span className="text-[9px] uppercase border border-border px-1 py-0.2 rounded font-bold ml-2">
                  [{todo.priority}]
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
