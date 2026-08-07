---
name: api-designer
description: Skill thiết kế và kiểm tra API Endpoints chuẩn Serverpod REST/WebSocket contracts.
---

# API Designer Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent thiết kế, triển khai và kiểm tra API Endpoints tuân thủ 100% Single Source of Truth tại [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) và các tệp đặc tả dịch vụ tại `docs/services/<service_name>.md`.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý code API khi chưa kiểm tra hợp đồng API gốc.

```text
[ CỔNG 1: READ API CONTRACTS ] ──► [ CỔNG 2: API PAYLOAD CHECKLIST ] ──► [ CỔNG 3: CODE / UPDATE API ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ API CONTRACTS FIRST (KHÔNG SỬA CODE NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi khởi tạo hoặc chỉnh sửa bất kỳ tệp API Endpoint nào (Dart Serverpod / React Web Service / Flutter Client), AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) - Quy chuẩn Schema Database & RPC API Endpoints tổng quan.
2. 👉 `docs/services/<service_name>.md` - Tệp đặc tả dịch vụ cụ thể liên quan đến API.

> ⚠️ **STRICT GUARDRAIL**: Bất kể chế độ `ponytail` hay lời gọi shortcut nào, Agent **KHÔNG ĐƯỢC PHÉP** tạo hoặc can thiệp code API nếu chưa có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: API CONTRACT & PAYLOAD CHECKLIST

1. **Standardized Response Envelope**: Response HTTP/RPC bắt buộc tuân thủ định dạng chuẩn `{ "success": boolean, "data": ... }`.
2. **Serverpod Exception Handling**: Mọi lỗi xử lý tại Backend phải ném ra `ServerpodException` với `errorCode` dạng hằng số chữ hoa (ví dụ: `AUTH_INVALID_CREDENTIALS`).
3. **Trust Boundary Validation**: Validate dữ liệu đầu vào bằng Zod (Frontend) và Dart boundary check (Serverpod).
4. **WebSocket Realtime Format**: Tên và payload sự kiện WebSocket bắt buộc tuân thủ chuẩn `namespace.event_name` (ví dụ: `auth.otp_sent`).
5. **No Mock Data & 5 RBAC System Roles**: Tuyệt đối KHÔNG MOCK DATA. Phân quyền API bắt buộc kết nối đủ 5 System Roles từ `docs/data_and_api.md`: `GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`.

---

### 🟡 CỔNG 3: API IMPLEMENTATION / CONTRACT UPDATE

Tiến hành lập trình hoặc cập nhật API Endpoint tại Backend Serverpod, Web Service layer hoặc Mobile Client SDK.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi triển khai API, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả xuất ra **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
