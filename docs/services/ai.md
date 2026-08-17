# AI Semantic Search & RAG Service Specification (`ai.md`)

> **Service**: `AI Semantic Search & RAG Assistant Service`  
> **Package**: `apps/server/lib/src/endpoints/ai_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ AI Semantic Search & RAG Assistant Service cung cấp năng lực tìm kiếm ngữ nghĩa và trợ lý hỏi đáp thông minh dựa trên toàn bộ kho tri thức cá nhân và nội bộ tổ chức. Khi nội dung ghi chú (Tiptap AST JSON) được lưu, hệ thống tự động bóc tách văn bản thô (Plain Text Extraction), chia nhỏ thành các đoạn logic (Recursive Character Chunking: 512–1024 tokens kèm 10% overlap), tạo Vector Embeddings (1536 chiều qua Gemini/OpenAI Embedding Models) và lưu trữ trong bảng `node_embeddings` với chỉ mục HNSW của PostgreSQL `pgvector`. Dịch vụ hỗ trợ: tìm kiếm ngữ nghĩa siêu tốc (Cosine Distance `<=>` dưới 10ms), tổng hợp câu trả lời có trích dẫn nguồn chính xác (Context Grounding RAG), và tự động tạo thẻ ghi nhớ/tóm tắt nội dung ghi chú.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `AiEndpoint.semanticSearch(Session session, SemanticSearchInput input)`
- `AiEndpoint.askAssistant(Session session, AskAssistantInput input)`
- `AiEndpoint.summarizeNode(Session session, SummarizeNodeInput input)`
- `AiEndpoint.generateActionItems(Session session, GenerateActionItemsInput input)`
- `AiEndpoint.reindexWorkspaceEmbeddings(Session session, ReindexWorkspaceInput input)`
- `AiEndpoint.getEmbeddingStatus(Session session, String nodeId)`

---

### 3. Request
Cấu trúc Request DTOs:

```typescript
interface SemanticSearchInput {
  workspaceId?: string;
  query: string;
  topK?: number;
  minSimilarityScore?: number;
  filterNodeTypes?: Array<'DOCUMENT' | 'SECTION'>;
}

interface AskAssistantInput {
  workspaceId?: string;
  nodeIds?: string[];
  question: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface SummarizeNodeInput {
  nodeId: string;
  targetLength?: 'SHORT' | 'MEDIUM' | 'DETAILED';
  language?: 'vi' | 'en';
}

interface GenerateActionItemsInput {
  nodeId: string;
}

interface ReindexWorkspaceInput {
  workspaceId: string;
  forceRecreate?: boolean;
}
```

---

### 4. Response
Cấu trúc Response DTOs:

```typescript
interface SearchChunkResult {
  nodeId: string;
  nodeTitle: string;
  workspaceId: string;
  workspaceTitle: string;
  chunkContent: string;
  similarityScore: number;
  highlightSnippets: string[];
}

interface SemanticSearchResponse {
  query: string;
  results: SearchChunkResult[];
  totalMatched: number;
  executionTimeMs: number;
}

interface GroundedSource {
  nodeId: string;
  nodeTitle: string;
  snippet: string;
  confidence: number;
}

interface AskAssistantResponse {
  question: string;
  answer: string;
  sources: GroundedSource[];
  tokensUsed: number;
  latencyMs: number;
}

interface SummarizeNodeResponse {
  nodeId: string;
  summary: string;
  keyPoints: string[];
}

interface ActionItemResult {
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedDueDate?: string;
}

interface GenerateActionItemsResponse {
  nodeId: string;
  actionItems: ActionItemResult[];
}

interface EmbeddingStatusResponse {
  nodeId: string;
  isIndexed: boolean;
  chunksCount: number;
  lastIndexedAt?: string;
}
```

---

### 5. Validation
Quy chuẩn kiểm tra tính hợp lệ dữ liệu đầu vào:
- `query` / `question`: Bắt buộc, chuỗi từ 2 đến 2000 ký tự.
- `topK`: Số nguyên dương từ 1 đến 50 (Mặc định: 10).
- `minSimilarityScore`: Số thực trong khoảng `0.0` đến `1.0` (Mặc định: `0.65`).
- `nodeIds`: Mảng tối đa 20 Node UUIDs khi hỏi đáp có giới hạn phạm vi tài liệu.

---

### 6. Permissions
Ma trận Phân quyền Truy cập (RBAC Matrix):

| Endpoint Method | GUEST | USER | ORG_MEMBER | ORG_ADMIN | SYSTEM_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `AiEndpoint.semanticSearch` | ❌ (Public only) | ✅ (Personal Scope) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `AiEndpoint.askAssistant` | ❌ (Public only) | ✅ (Personal Scope) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `AiEndpoint.summarizeNode` | ❌ | ✅ (Owner/Viewer) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `AiEndpoint.generateActionItems` | ❌ | ✅ (Owner/Editor) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `AiEndpoint.reindexWorkspaceEmbeddings` | ❌ | ✅ (Owner) | ❌ | ✅ (Org Scope) | ✅ (All) |
| `AiEndpoint.getEmbeddingStatus` | ❌ (Public only) | ✅ (Owner/Viewer) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |

---

### 7. Errors
Bảng mã lỗi và HTTP Status tương ứng:

| Mã Lỗi (Error Code) | HTTP Status | Nguyên nhân | Hướng xử lý Client |
| :--- | :--- | :--- | :--- |
| `AI_RATE_LIMIT_EXCEEDED` | `429 Too Many Requests` | Vượt quá số lượt truy vấn AI cho phép trong 1 phút hoặc hạn mức gói. | Yêu cầu người dùng chờ và thử lại. |
| `INSUFFICIENT_CONTEXT` | `404 Not Found` | Không tìm thấy đoạn văn bản phù hợp để trả lời câu hỏi RAG. | Gợi ý người dùng diễn đạt lại hoặc bổ sung thêm ghi chú. |
| `EMBEDDING_GENERATION_FAILED` | `502 Bad Gateway` | Lỗi kết nối hoặc timeout tới AI Embedding Provider (Gemini/OpenAI). | Thử lại tự động qua hàng đợi FutureCalls. |
| `FORBIDDEN` | `403 Forbidden` | Không có quyền truy cập vào Workspace chứa tài liệu tìm kiếm. | Báo lỗi không đủ thẩm quyền truy cập. |
| `INVALID_INPUT` | `400 Bad Request` | Câu hỏi hoặc từ khóa tìm kiếm rỗng/không hợp lệ. | Báo lỗi validation. |
| `INTERNAL_ERROR` | `500 Internal Error` | Lỗi thực thi truy vấn HNSW Vector Search trong PostgreSQL. | Báo lỗi hệ thống nội bộ. |

---

### 8. Events
Danh sách Domain Events phát sinh:
- `ai.indexed`: Phát ra khi hoàn tất chunking và tạo vector embeddings cho một Node.
- `ai.searched`: Phát ra khi người dùng thực hiện truy vấn tìm kiếm ngữ nghĩa.
- `ai.question_answered`: Phát ra khi Trợ lý RAG hoàn tất tổng hợp câu trả lời.
- `ai.reindexed`: Phát ra khi toàn bộ Workspace được đánh lại chỉ mục vector.

---

### 9. Cache
Chiến lược Caching qua Redis:
- **Keys & TTL**:
  - `ai:search:{sha256(query_workspace)}` -> Kết quả tìm kiếm ngữ nghĩa (TTL: 10m).
  - `ai:node:{node_id}:summary` -> Tóm tắt nội dung của node (TTL: 24h).
  - `ai:user:{user_id}:rate_limit` -> Bộ đếm token/requests trong cửa sổ 1 phút (TTL: 1m).
- **Invalidation Strategy**:
  - Khi node cập nhật nội dung mới -> Xóa cache `ai:node:{node_id}:summary` và kích hoạt re-embedding ngầm.

---

### 10. Examples
Ví dụ tích hợp TypeScript Frontend Client:

```typescript
import { api } from '@/services/api';

// 1. Tìm kiếm ngữ nghĩa tài liệu trong Workspace
const searchResponse = await api.post('/rpc/ai/semanticSearch', {
  workspaceId: 'workspace-uuid',
  query: 'Làm thế nào để xử lý xung đột ghi đồng thời bằng OCC?',
  topK: 5,
  minSimilarityScore: 0.7
});
console.log('Các đoạn tài liệu khớp nhất:', searchResponse.data.results);

// 2. Hỏi đáp Trợ lý AI RAG có kèm trích dẫn nguồn
const answerResponse = await api.post('/rpc/ai/askAssistant', {
  workspaceId: 'workspace-uuid',
  question: 'Tóm tắt các quy tắc Zero-Icon UI trong dự án'
});
console.log('Câu trả lời:', answerResponse.data.answer);
console.log('Nguồn tài liệu trích dẫn:', answerResponse.data.sources);
```
