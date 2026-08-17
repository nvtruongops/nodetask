# Background Jobs & Export Service Specification (`job.md`)

> **Service**: `Background Jobs & Export Service`  
> **Package**: `apps/server/lib/src/endpoints/job_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ Background Jobs & Export Service đảm nhận việc xử lý các tác vụ bất đồng bộ nặng (Heavy Asynchronous Workloads) và xuất bản dữ liệu tài liệu sang các định dạng tiêu chuẩn (PDF, Markdown, HTML, JSON Backup) thông qua cơ chế Serverpod FutureCalls Engine. Dịch vụ hỗ trợ: lập lịch tạo bản sao lưu Workspace, kết xuất toàn bộ cây bài học thành tài liệu PDF/Markdown hoàn chỉnh có mục lục phân cấp, theo dõi trạng thái tiến trình (Job Status: `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`), tự động thu dọn các tệp tạm thời sau khi hết hạn (TTL cleanup), và thông báo cho Client qua WebSocket khi tác vụ kết thúc.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `JobEndpoint.requestExport(Session session, RequestExportInput input)`
- `JobEndpoint.getJobStatus(Session session, String jobId)`
- `JobEndpoint.cancelJob(Session session, String jobId)`
- `JobEndpoint.listUserJobs(Session session, ListUserJobsInput input)`
- `JobEndpoint.downloadExportResult(Session session, String jobId)`

---

### 3. Request
Cấu trúc Request DTOs:

```typescript
type ExportFormat = 'PDF' | 'MARKDOWN' | 'HTML' | 'WORKSPACE_JSON';
type JobType = 'EXPORT_DOCUMENT' | 'EXPORT_WORKSPACE' | 'BACKUP_FULL' | 'REINDEX_AI';

interface RequestExportInput {
  targetType: 'NODE' | 'WORKSPACE';
  targetId: string;
  format: ExportFormat;
  includeAttachments?: boolean;
  includeTodos?: boolean;
}

interface ListUserJobsInput {
  jobType?: JobType;
  status?: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  page?: number;
  pageSize?: number;
}
```

---

### 4. Response
Cấu trúc Response DTOs:

```typescript
type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

interface BackgroundJobResponse {
  jobId: string;
  userId: string;
  jobType: JobType;
  status: JobStatus;
  progressPercentage: number;
  downloadUrl?: string;
  errorMessage?: string;
  fileSizeBytes?: number;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

interface RequestExportResponse {
  jobId: string;
  status: JobStatus;
  estimatedTimeSeconds: number;
}

interface ListUserJobsResponse {
  jobs: BackgroundJobResponse[];
  totalCount: number;
}
```

---

### 5. Validation
Quy chuẩn kiểm tra tính hợp lệ dữ liệu đầu vào:
- `targetId`: Bắt buộc, chuỗi UUID hợp lệ.
- `format`: Bắt buộc thuộc enum `PDF`, `MARKDOWN`, `HTML`, `WORKSPACE_JSON`.
- `targetType`: Bắt buộc thuộc enum `NODE` hoặc `WORKSPACE`.

---

### 6. Permissions
Ma trận Phân quyền Truy cập (RBAC Matrix):

| Endpoint Method | GUEST | USER | ORG_MEMBER | ORG_ADMIN | SYSTEM_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `JobEndpoint.requestExport` | ❌ | ✅ (Owner/Viewer) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `JobEndpoint.getJobStatus` | ❌ | ✅ (Owner) | ✅ (Owner) | ✅ (Org Scope) | ✅ (All) |
| `JobEndpoint.cancelJob` | ❌ | ✅ (Owner) | ✅ (Owner) | ✅ (Org Scope) | ✅ (All) |
| `JobEndpoint.listUserJobs` | ❌ | ✅ (Self) | ✅ (Self) | ✅ (Org Scope) | ✅ (All) |
| `JobEndpoint.downloadExportResult` | ❌ | ✅ (Owner) | ✅ (Owner) | ✅ (Org Scope) | ✅ (All) |

---

### 7. Errors
Bảng mã lỗi và HTTP Status tương ứng:

| Mã Lỗi (Error Code) | HTTP Status | Nguyên nhân | Hướng xử lý Client |
| :--- | :--- | :--- | :--- |
| `JOB_NOT_FOUND` | `404 Not Found` | Không tìm thấy `jobId` trong hệ thống. | Báo lỗi tác vụ không tồn tại. |
| `EXPORT_EXPIRED` | `410 Gone` | Tệp xuất bản đã hết thời hạn lưu trữ tạm thời (TTL). | Yêu cầu tạo lại lệnh xuất bản mới. |
| `JOB_ALREADY_COMPLETED` | `400 Bad Request` | Cố gắng hủy tác vụ đã hoàn thành. | Tải file kết quả thay vì hủy. |
| `FORBIDDEN` | `403 Forbidden` | Không có quyền xem hoặc hủy tác vụ của người khác. | Báo lỗi phân quyền. |
| `INVALID_INPUT` | `400 Bad Request` | Dữ liệu đầu vào không hợp lệ. | Hiển thị lỗi form. |
| `INTERNAL_ERROR` | `500 Internal Error` | Lỗi trong quá trình render PDF hoặc nén file. | Báo lỗi hệ thống. |

---

### 8. Events
Danh sách Domain Events phát sinh:
- `job.queued`: Phát ra khi tác vụ nền được xếp vào hàng đợi Serverpod FutureCalls.
- `job.started`: Phát ra khi worker bắt đầu xử lý tác vụ.
- `job.completed`: Phát ra khi tệp xuất bản được tạo thành công và tải lên Storage.
- `job.failed`: Phát ra khi tác vụ gặp lỗi ngoại lệ.

---

### 9. Cache
Chiến lược Caching qua Redis:
- **Keys & TTL**:
  - `job:{job_id}:status` -> Trạng thái và tiến độ của tác vụ nền (TTL: 2h).
  - `job:user:{user_id}:recent` -> Danh sách tác vụ gần đây của người dùng (TTL: 10m).
- **Invalidation Strategy**:
  - Khi worker cập nhật tiến độ hoặc hoàn tất tác vụ -> Cập nhật key `job:{job_id}:status` và gửi thông báo WebSocket.

---

### 10. Examples
Ví dụ tích hợp TypeScript Frontend Client:

```typescript
import { api } from '@/services/api';

// 1. Gửi yêu cầu xuất toàn bộ Workspace ra file PDF
const exportJob = await api.post('/rpc/job/requestExport', {
  targetType: 'WORKSPACE',
  targetId: 'workspace-uuid',
  format: 'PDF',
  includeAttachments: true,
  includeTodos: true
});
console.log('Mã tác vụ xuất bản:', exportJob.data.jobId);

// 2. Tra cứu trạng thái tác vụ
const statusResponse = await api.get(`/rpc/job/getJobStatus?jobId=${exportJob.data.jobId}`);
if (statusResponse.data.status === 'COMPLETED') {
  console.log('Link tải file PDF:', statusResponse.data.downloadUrl);
}
```
