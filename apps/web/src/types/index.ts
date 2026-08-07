export type NodeType = 'WORKSPACE' | 'FOLDER' | 'DOCUMENT' | 'SECTION' | 'TOPIC' | 'MODULE' | 'SESSION' | 'SUBSESSION';

export interface Workspace {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  createdAt?: string;
}

export interface DocumentNode {
  id: string;
  workspaceId: string;
  parentId?: string | null;
  path?: string | null;
  nodeType: NodeType;
  title: string;
  content?: string | null; // Tiptap JSON AST string or plain text
  position: number;
  version: number;
  createdAt?: string;
  children?: DocumentNode[];
}

// Backward compatibility type aliases
export type Course = Workspace;
export type CourseNode = DocumentNode;

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

export interface ContactFormDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  ticketId: string;
  message: string;
}

