---
name: service-designer
description: Skill thiết kế và cập nhật các file đặc tả dịch vụ Backend trong docs/services/*.md tuân thủ Schema Contract.
---

# Service Designer Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent thiết kế và cập nhật các file đặc tả dịch vụ Backend trong `docs/services/*.md` tuân thủ 100% Schema Contract tại [`.agents/schemas/service-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/service-doc.yaml).

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý tạo/sửa file spec khi chưa thực hiện kiểm tra tài liệu nền tảng.

```text
[ CỔNG 1: READ SCHEMA & DATA DOCS ] ──► [ CỔNG 2: SCHEMA CHECKLIST ] ──► [ CỔNG 3: GENERATE / UPDATE SPEC ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ SCHEMA & DATA DOCS FIRST (KHÔNG SỬA SPEC NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi khởi tạo hoặc chỉnh sửa bất kỳ tệp đặc tả dịch vụ nào trong `docs/services/*.md`, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP**:

1. 👉 [`.agents/schemas/service-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/service-doc.yaml) - Schema contract quy định 10 sections bắt buộc.
2. 👉 [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) - Cấu trúc PostgreSQL Schema & Data Models gốc.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** ghi hoặc cập nhật file spec dịch vụ trước khi có tool call `view_file` đọc schema contract trong phiên làm việc.

---

### 🔵 CỔNG 2: MANDATORY SCHEMA & CONTRACT CHECKLIST

Mọi file `docs/services/*.md` BẮT BỘC phải đáp ứng 100% các tiêu chí sau:

1. **10 Mandatory Sections (Đủ 10 Mục Bắt Buộc)**:
   - `Overview`: Tóm tắt vai trò và ranh giới nghiệp vụ của dịch vụ.
   - `Endpoints`: Chữ ký Endpoint phải theo chuẩn Serverpod Dart `EndpointClass.method(Session session, InputDTO input)`.
   - `Request`: Khai báo DTOs dạng `interface`.
   - `Response`: Khai báo DTOs dạng `interface`.
   - `Validation`: Ranh giới kiểm tra dữ liệu đầu vào.
   - `Permissions`: Bảng RBAC chứa đủ 5 roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`).
   - `Errors`: Mã lỗi viết hoa dạng `SERVICE_CODE` bọc trong backticks (ví dụ: `AUTH_INVALID_CREDENTIALS`) kèm bảng `HTTP Status`.
   - `Events`: Tên sự kiện Realtime dạng `namespace.event_name` (ví dụ: `auth.otp_sent`).
   - `Cache`: Khai báo chiến lược Redis `TTL` và `Invalidation`.
   - `Examples`: Mã nguồn ví dụ dạng khối ` ```typescript `.
2. **No Mock Data & Strict System Roles**: 100% Data Models và Roles tuân thủ Single Source of Truth tại `docs/data_and_api.md`.

---

### 🟡 CỔNG 3: SPECIFICATION FILE GENERATION / UPDATE

Tiến hành khởi tạo hoặc cập nhật tệp đặc tả dịch vụ tuân thủ đúng định dạng Markdown đã được phê duyệt.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi tạo hoặc chỉnh sửa tệp đặc tả tại `docs/services/*.md`, Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả xuất ra **PASS (0 Errors, 0 Warnings)** mới được phép kết thúc công việc.
