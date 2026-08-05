import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { CourseNode } from '../../types';
import { apiService } from '../../services/api';

interface TiptapEditorProps {
  node: CourseNode | null;
  onSaved?: () => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ node, onSaved }) => {
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const [titleText, setTitleText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4 bg-background font-mono text-sm leading-relaxed border border-border rounded',
      },
    },
  });

  useEffect(() => {
    if (node) {
      setTitleText(node.title);
      if (editor) {
        try {
          const parsed = node.content ? JSON.parse(node.content) : '';
          editor.commands.setContent(parsed);
        } catch {
          editor.commands.setContent(node.content || '');
        }
      }
    }
  }, [node, editor]);

  const handleSave = async () => {
    if (!node || !editor) return;
    setSaveStatus('SAVING');

    const jsonAST = JSON.stringify(editor.getJSON());
    await apiService.updateNodeContent(node.id, jsonAST);

    setSaveStatus('SAVED');
    if (onSaved) onSaved();

    setTimeout(() => setSaveStatus('IDLE'), 2000);
  };

  if (!node) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-muted-foreground p-8">
        <div className="border border-border p-6 rounded bg-card text-center">
          <p className="font-bold mb-2">[NO NODE SELECTED]</p>
          <p>Select a node from the course navigation tree on the left to edit content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-6 font-mono select-none">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div>
          <span className="text-xs uppercase text-muted-foreground block mb-1">
            [{node.nodeType}] PATH: {node.path || node.id} | VERSION: {node.version}
          </span>
          <h1 className="text-xl font-bold tracking-tight">{titleText}</h1>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground font-mono">
            STATUS: [{saveStatus}]
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 border border-foreground bg-primary text-primary-foreground font-bold hover:opacity-90 rounded transition-opacity"
          >
            [SAVE AST]
          </button>
        </div>
      </div>

      {/* Zero-Icon Formatting Toolbar */}
      {editor && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 p-1.5 border border-border bg-muted/40 rounded text-xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('bold')
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [BOLD]
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('italic')
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [ITALIC]
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [H1]
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [H2]
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('bulletList')
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [LIST]
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 border rounded ${
              editor.isActive('codeBlock')
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'border-border hover:bg-muted'
            }`}
          >
            [CODE]
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
