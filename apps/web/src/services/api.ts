import { Course, CourseNode, NodeTodo, AIAskResponse } from '../types';

// Initial Mock Course Tree matching PostgreSQL ltree structure
const INITIAL_COURSES: Course[] = [
  {
    id: 'course-default-1',
    userId: 'user-admin',
    title: 'Advanced Computer Science & Monorepo Architecture',
    description: 'Hierarchical node tree with PostgreSQL ltree, Serverpod backend, and Zero-Icon monochrome UI.',
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_NODES: CourseNode[] = [
  {
    id: 'node-topic-1',
    courseId: 'course-default-1',
    parentId: null,
    path: 'cs_architecture',
    nodeType: 'TOPIC',
    title: '1. Monorepo Architecture & AI Governance',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '1. Monorepo Architecture & AI Governance' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This course node covers high-performance hierarchical structure management using PostgreSQL LTREE, Serverpod backend endpoints, and zero-icon monochrome React frontend.',
            },
          ],
        },
      ],
    }),
    position: 0,
    version: 1,
  },
  {
    id: 'node-module-1',
    courseId: 'course-default-1',
    parentId: 'node-topic-1',
    path: 'cs_architecture.serverpod_backend',
    nodeType: 'MODULE',
    title: '1.1 Serverpod & PostgreSQL LTREE Engine',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1.1 Serverpod & PostgreSQL LTREE Engine' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Serverpod code-first YAML models generate Dart & TypeScript SDKs. LTREE paths allow quick recursive subtree queries without exponential SQL joins.',
            },
          ],
        },
      ],
    }),
    position: 0,
    version: 1,
  },
  {
    id: 'node-session-1',
    courseId: 'course-default-1',
    parentId: 'node-module-1',
    path: 'cs_architecture.serverpod_backend.occ_versioning',
    nodeType: 'SESSION',
    title: '1.1.1 OCC Versioning & Optimistic UI (<16ms)',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: '1.1.1 OCC Versioning & Optimistic UI' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Optimistic concurrency control ensures concurrent edits fail cleanly with VERSION_CONFLICT error code when version counters mismatch.',
            },
          ],
        },
      ],
    }),
    position: 0,
    version: 1,
  },
  {
    id: 'node-topic-2',
    courseId: 'course-default-1',
    parentId: null,
    path: 'frontend_design',
    nodeType: 'TOPIC',
    title: '2. Zero-Icon Monochrome UI/UX Design System',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '2. Zero-Icon Monochrome UI/UX Design System' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Minimalist design philosophy with 0 icon dependencies. Uses text labels, brackets [ ], [+] and typography hierarchy.',
            },
          ],
        },
      ],
    }),
    position: 1,
    version: 1,
  },
];

const INITIAL_TODOS: Record<string, NodeTodo[]> = {
  'node-topic-1': [
    {
      id: 'todo-1',
      nodeId: 'node-topic-1',
      userId: 'user-admin',
      title: 'Initialize Phase 1 Monorepo & Docker environment',
      isCompleted: true,
      priority: 'HIGH',
    },
    {
      id: 'todo-2',
      nodeId: 'node-topic-1',
      userId: 'user-admin',
      title: 'Setup PostgreSQL ltree & pgvector extension tables',
      isCompleted: true,
      priority: 'HIGH',
    },
  ],
  'node-module-1': [
    {
      id: 'todo-3',
      nodeId: 'node-module-1',
      userId: 'user-admin',
      title: 'Implement OCC Version check on Serverpod PutNode endpoint',
      isCompleted: false,
      priority: 'MEDIUM',
    },
  ],
};

let nodesState: CourseNode[] = [...INITIAL_NODES];
let todosState: Record<string, NodeTodo[]> = { ...INITIAL_TODOS };

export const apiService = {
  async getCourses(): Promise<Course[]> {
    return INITIAL_COURSES;
  },

  async getCourseTree(courseId: string): Promise<CourseNode[]> {
    return nodesState.filter((node) => node.courseId === courseId);
  },

  async updateNodeContent(nodeId: string, content: string): Promise<CourseNode> {
    const node = nodesState.find((n) => n.id === nodeId);
    if (!node) throw new Error('Node not found');
    node.content = content;
    node.version += 1;
    return node;
  },

  async createNode(newNode: Partial<CourseNode>): Promise<CourseNode> {
    const node: CourseNode = {
      id: `node-${Date.now()}`,
      courseId: newNode.courseId || 'course-default-1',
      parentId: newNode.parentId || null,
      nodeType: newNode.nodeType || 'SESSION',
      title: newNode.title || 'Untitled Node',
      content: newNode.content || null,
      position: nodesState.length,
      version: 1,
    };
    nodesState.push(node);
    return node;
  },

  async deleteNode(nodeId: string): Promise<void> {
    nodesState = nodesState.filter((n) => n.id !== nodeId && n.parentId !== nodeId);
  },

  async getTodos(nodeId: string): Promise<NodeTodo[]> {
    return todosState[nodeId] || [];
  },

  async toggleTodo(nodeId: string, todoId: string): Promise<NodeTodo> {
    const list = todosState[nodeId] || [];
    const item = list.find((t) => t.id === todoId);
    if (!item) throw new Error('Todo not found');
    item.isCompleted = !item.isCompleted;
    return item;
  },

  async addTodo(nodeId: string, title: string): Promise<NodeTodo> {
    const newTodo: NodeTodo = {
      id: `todo-${Date.now()}`,
      nodeId,
      userId: 'user-admin',
      title,
      isCompleted: false,
      priority: 'MEDIUM',
    };
    if (!todosState[nodeId]) {
      todosState[nodeId] = [];
    }
    todosState[nodeId].push(newTodo);
    return newTodo;
  },

  async askAI(question: string): Promise<AIAskResponse> {
    return {
      answer: `[AI RAG Response]: Based on your course nodes, "${question}" relates to Serverpod OCC Versioning and PostgreSQL LTREE path indexing. Check node-session-1 for code details.`,
      sources: [
        {
          nodeId: 'node-session-1',
          title: '1.1.1 OCC Versioning & Optimistic UI (<16ms)',
          score: 0.94,
          snippet: 'Optimistic concurrency control ensures concurrent edits fail cleanly...',
        },
      ],
    };
  },
};
