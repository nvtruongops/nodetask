---
name: service-designer
description: Skill thiết kế và cập nhật các file đặc tả dịch vụ Backend trong docs/services/*.md tuân thủ Schema Contract.
---

# Service Designer Skill

## Overview

Skill **`service-designer`** hướng dẫn AI Agent thiết kế và cập nhật các file đặc tả dịch vụ Backend trong `docs/services/*.md` tuân thủ 100% Schema Contract.

---

## 1. 📖 Required Reading (Bắt Buộc Tra Cứu)

Trước khi khởi tạo hoặc chỉnh sửa bất kỳ dịch vụ nào, AI Agent **BẮT BỘC** đọc Schema Contract tại:
👉 [`.agents/schemas/service-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/service-doc.yaml)

---

## 2. 📋 Execution Checklist

- [ ] **10 Mandatory Sections**: `Overview`, `Endpoints`, `Request`, `Response`, `Validation`, `Permissions`, `Errors`, `Events`, `Cache`, `Examples`.
- [ ] **Serverpod RPC Signatures**: Phải có cú pháp `EndpointClass.method(Session session, InputDTO input)`.
- [ ] **No Mock Data & 5 RBAC Roles**: Section `Permissions` BẮT BỘC chứa đủ 5 roles: `GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`.
- [ ] **DTO Contracts**: `Request` & `Response` phải chứa định nghĩa `interface`.
- [ ] **Error Constants**: Section `Errors` chứa hằng số mã lỗi dạng `SERVICE_CODE` kèm bảng `HTTP Status`.
- [ ] **Events Format**: Section `Events` chứa định dạng `service.event_name`.
- [ ] **Redis Cache Rules**: Section `Cache` chứa từ khóa `TTL` và `Invalidation`.
- [ ] **Code Examples**: Section `Examples` chứa ` ```typescript ` code block.

---

## 3. 🧪 Verification & Completion Loop

Sau khi tạo hoặc chỉnh sửa file đặc tả tại `docs/services/*.md`, Agent **BẮT BỘC** thực hiện kiểm thử:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả xuất ra **PASS (0 Errors, 0 Warnings)** mới kết thúc công việc.
