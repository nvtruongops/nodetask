# Storage & File Attachments Service Specification (`storage.md`)

> **Service**: `Storage & File Attachments Service`  
> **Package**: `apps/server/lib/src/endpoints/storage_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ Storage & File Attachments Service chịu trách nhiệm quản lý toàn bộ tệp tin đa phương tiện và file đính kèm trong nền tảng `nodetask`. Dịch vụ hỗ trợ: tải lên file nhúng trong ghi chú Tiptap (ảnh JPG/PNG/WebP/SVG), tài liệu đính kèm nút (`node_attachments` như PDF, Word, Excel, Markdown, Zip), tệp xuất bản tạm thời (PDF/HTML export), và ảnh đại diện Workspace/User. Hạ tầng lưu trữ trừu tượng hóa qua Storage Driver Adapter hỗ trợ S3/Cloudflare R2, MinIO Self-hosted hoặc Local Disk Storage, tích hợp cơ chế cấp Presigned Upload URLs, kiểm tra mã băm SHA-256 chống trùng lặp dữ liệu (Deduplication), quét mã độc MIME type và quản lý hạn ngạch dung lượng (Storage Quota).

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `StorageEndpoint.requestUploadUrl(Session session, RequestUploadUrlInput input)`
- `StorageEndpoint.confirmUpload(Session session, ConfirmUploadInput input)`
- `StorageEndpoint.getFileMetadata(Session session, String fileId)`
- `StorageEndpoint.listNodeAttachments(Session session, String nodeId)`
- `StorageEndpoint.attachFileToNode(Session session, AttachFileInput input)`
- `StorageEndpoint.detachFileFromNode(Session session, DetachFileInput input)`
- `StorageEndpoint.deleteFile(Session session, String fileId)`
- `StorageEndpoint.getUserStorageUsage(Session session)`

---

### 3. Request
Cấu trúc Request DTOs:

```typescript
type FileCategory = 'EMBEDDED_IMAGE' | 'ATTACHMENT' | 'AVATAR' | 'EXPORT_TEMP';

interface RequestUploadUrlInput {
  workspaceId?: string;
  nodeId?: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  category: FileCategory;
  checksumSha256?: string;
}

interface ConfirmUploadInput {
  fileId: string;
  storageKey: string;
}

interface AttachFileInput {
  nodeId: string;
  fileId: string;
  displayName?: string;
}

interface DetachFileInput {
  nodeId: string;
  fileId: string;
}

interface ListNodeAttachmentsInput {
  nodeId: string;
  category?: FileCategory;
}
```

---

### 4. Response
Cấu trúc Response DTOs:

```typescript
interface RequestUploadUrlResponse {
  fileId: string;
  uploadUrl: string; // Presigned S3/R2 PUT URL hoặc Internal Upload Gateway
  storageKey: string;
  expiresInSeconds: number;
  isDuplicateDetected: boolean; // Nếu file đã tồn tại theo SHA-256 hash
}

interface FileMetadataResponse {
  id: string;
  workspaceId?: string;
  userId: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  category: FileCategory;
  publicUrl: string;
  storageProvider: 'S3' | 'R2' | 'MINIO' | 'LOCAL';
  checksumSha256?: string;
  createdAt: string;
}

interface NodeAttachmentItem {
  attachmentId: string;
  nodeId: string;
  file: FileMetadataResponse;
  displayName: string;
  attachedAt: string;
}

interface StorageUsageResponse {
  usedBytes: number;
  quotaBytes: number;
  usagePercentage: number;
  filesCount: number;
}
```

---

### 5. Validation
Quy chuẩn kiểm tra tính hợp lệ dữ liệu đầu vào:
- `fileName`: Bắt buộc, chuỗi từ 1 đến 255 ký tự, không chứa ký tự cấm `/ \ : * ? " < > |`.
- `fileSizeBytes`: Bắt buộc, giới hạn tối đa tùy danh mục:
  - `EMBEDDED_IMAGE`: Tối đa 10 MB (`10 * 1024 * 1024` bytes).
  - `ATTACHMENT`: Tối đa 50 MB (`50 * 1024 * 1024` bytes).
  - `AVATAR`: Tối đa 2 MB (`2 * 1024 * 1024` bytes).
- `mimeType`: Bắt buộc nằm trong danh sách whitelist cho phép: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `application/pdf`, `text/plain`, `text/markdown`, `application/zip`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

---

### 6. Permissions
Ma trận Phân quyền Truy cập (RBAC Matrix):

| Endpoint Method | GUEST | USER | ORG_MEMBER | ORG_ADMIN | SYSTEM_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `StorageEndpoint.requestUploadUrl` | ❌ | ✅ (Personal Quota) | ✅ (Org Quota) | ✅ (Org Quota) | ✅ (Unlimited) |
| `StorageEndpoint.confirmUpload` | ❌ | ✅ (Owner) | ✅ (Owner) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.getFileMetadata` | ❌ (Public only) | ✅ (Owner/Shared) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.listNodeAttachments` | ❌ (Public only) | ✅ (Owner/Shared) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.attachFileToNode` | ❌ | ✅ (Editor/Owner) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.detachFileFromNode` | ❌ | ✅ (Editor/Owner) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.deleteFile` | ❌ | ✅ (Owner) | ✅ (Owner) | ✅ (Org Scope) | ✅ (All) |
| `StorageEndpoint.getUserStorageUsage` | ❌ | ✅ (Self) | ✅ (Self) | ✅ (Org Scope) | ✅ (All) |

---

### 7. Errors
Bảng mã lỗi và HTTP Status tương ứng:

| Mã Lỗi (Error Code) | HTTP Status | Nguyên nhân | Hướng xử lý Client |
| :--- | :--- | :--- | :--- |
| `STORAGE_QUOTA_EXCEEDED` | `413 Payload Too Large` | Người dùng hoặc tổ chức đã sử dụng hết dung lượng lưu trữ cho phép. | Gợi ý dọn dẹp file cũ hoặc nâng cấp gói lưu trữ. |
| `UNSUPPORTED_MIME_TYPE` | `415 Unsupported Media Type` | File tải lên không nằm trong danh mục định dạng được phép. | Thông báo định dạng tệp không được hỗ trợ. |
| `FILE_TOO_LARGE` | `413 Payload Too Large` | Kích thước file vượt quá ngưỡng tối đa cho danh mục tương ứng. | Chọn file có kích thước nhỏ hơn giới hạn. |
| `FILE_NOT_FOUND` | `404 Not Found` | Không tìm thấy tệp tin yêu cầu. | Thông báo tệp tin không tồn tại. |
| `FORBIDDEN` | `403 Forbidden` | Không có quyền thao tác trên tệp tin này. | Báo lỗi quyền truy cập. |
| `INTERNAL_ERROR` | `500 Internal Error` | Lỗi trong quá trình tạo Presigned URL hoặc giao tiếp S3/MinIO. | Thông báo thử lại sau ít phút. |

---

### 8. Events
Danh sách Domain Events phát sinh:
- `storage.uploaded`: Phát ra khi tệp tin được xác nhận tải lên thành công trên Object Storage.
- `storage.attached`: Phát ra khi tệp tin được liên kết vào một nút tài liệu.
- `storage.detached`: Phát ra khi tệp tin bị gỡ bỏ khỏi nút tài liệu.
- `storage.deleted`: Phát ra khi tệp tin bị xóa vĩnh viễn khỏi hệ thống lưu trữ.

---

### 9. Cache
Chiến lược Caching qua Redis:
- **Keys & TTL**:
  - `storage:file:{file_id}:meta` -> Siêu dữ liệu của tệp tin (TTL: 24h).
  - `storage:node:{node_id}:attachments` -> Danh sách file đính kèm theo node (TTL: 1h).
  - `storage:user:{user_id}:usage` -> Thống kê dung lượng đã dùng (TTL: 10m).
- **Invalidation Strategy**:
  - Khi có thao tác `attachFileToNode` hoặc `detachFileFromNode` -> Xóa cache `storage:node:{node_id}:attachments`.
  - Khi xác nhận upload hoặc xóa file -> Xóa cache `storage:user:{user_id}:usage` và `storage:file:{file_id}:meta`.

---

### 10. Examples
Ví dụ tích hợp TypeScript Frontend Client:

```typescript
import { api } from '@/services/api';

// 1. Yêu cầu Presigned URL để upload file ảnh trực tiếp lên Object Storage
const uploadSession = await api.post('/rpc/storage/requestUploadUrl', {
  nodeId: 'doc-node-123',
  fileName: 'system-architecture.png',
  fileSizeBytes: 2048500,
  mimeType: 'image/png',
  category: 'EMBEDDED_IMAGE'
});

// 2. Upload file nhị phân qua Fetch API
await fetch(uploadSession.data.uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/png' },
  body: fileBlob
});

// 3. Xác nhận hoàn tất upload
const confirmed = await api.post('/rpc/storage/confirmUpload', {
  fileId: uploadSession.data.fileId,
  storageKey: uploadSession.data.storageKey
});
console.log('Public URL của ảnh:', confirmed.data.publicUrl);
```
