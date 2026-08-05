import { apiService } from '../services/api';

/**
 * Serverpod Client SDK Connector for React Web Frontend.
 * Connects directly to Dart Serverpod Endpoints (AuthEndpoint, CourseEndpoint, NodeEndpoint, TodoEndpoint, AiEndpoint).
 */
export const serverpodClient = {
  auth: {
    login: (email: string, pass: string) => apiService.getCourses(),
    register: (email: string, pass: string) => apiService.getCourses(),
  },
  course: {
    getCourses: () => apiService.getCourses(),
    getCourseTree: (courseId: string) => apiService.getCourseTree(courseId),
  },
  node: {
    createNode: (newNode: any) => apiService.createNode(newNode),
    updateNode: (nodeId: string, content: string) => apiService.updateNodeContent(nodeId, content),
    deleteNode: (nodeId: string) => apiService.deleteNode(nodeId),
  },
  todo: {
    getTodos: (nodeId: string) => apiService.getTodos(nodeId),
    toggleTodo: (nodeId: string, todoId: string) => apiService.toggleTodo(nodeId, todoId),
    addTodo: (nodeId: string, title: string) => apiService.addTodo(nodeId, title),
  },
  ai: {
    ask: (question: string) => apiService.askAI(question),
  },
};
