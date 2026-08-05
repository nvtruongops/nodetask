export type NodeType = 'TOPIC' | 'MODULE' | 'SESSION' | 'SUBSESSION';

export interface Course {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  createdAt?: string;
}

export interface CourseNode {
  id: string;
  courseId: string;
  parentId?: string | null;
  path?: string | null;
  nodeType: NodeType;
  title: string;
  content?: string | null; // Tiptap JSON AST string or plain text
  position: number;
  version: number;
  createdAt?: string;
  children?: CourseNode[];
}

export interface NodeTodo {
  id: string;
  nodeId: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
  createdAt?: string;
}

export interface AISearchResult {
  nodeId: string;
  title: string;
  score: number;
  snippet: string;
}

export interface AIAskResponse {
  answer: string;
  sources: AISearchResult[];
}
