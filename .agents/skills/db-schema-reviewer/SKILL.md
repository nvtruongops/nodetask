---
name: db-schema-reviewer
description: Skill kiểm tra và đánh giá thiết kế Schema Database, Migration, LTREE và OCC Versioning.
---

# DB Schema Reviewer Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent kiểm tra, thiết kế và thực thi Schema Database, Migration, LTREE Indexing và Optimistic Concurrency Control (OCC) tuân thủ 100% [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md).

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý sửa file YAML model/Migration khi chưa kiểm tra quy chuẩn database.

```text
[ CỔNG 1: READ DB SCHEMA DOCS ] ──► [ CỔNG 2: SCHEMA & MIGRATION CHECKLIST ] ──► [ CỔNG 3: EXECUTE MIGRATION ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ DB SCHEMA DOCS FIRST (KHÔNG SỬA SCHEMA NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi tạo hoặc chỉnh sửa bất kỳ file model YAML (`apps/server/lib/src/models/*.spy.yaml`) hay SQL migration nào, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) - Quy chuẩn PostgreSQL Schema & LTREE Path Indexing.
2. 👉 `docs/services/<service_name>.md` - Tệp đặc tả dịch vụ Backend liên quan đến bảng dữ liệu.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** can thiệp tệp model YAML hoặc SQL migration trước khi có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: DB SCHEMA & MIGRATION CHECKLIST

1. **Model Location**: Tất cả các file YAML định nghĩa model BẮT BỘC nằm trong thư mục `apps/server/lib/src/models/`.
2. **PostgreSQL LTREE Indexing**: Các bảng cấu trúc cây phân cấp BẮT BỘC sử dụng kiểu dữ liệu `LTREE` cho trường `path` và tạo chỉ mục `GIST`.
3. **OCC Versioning**: Bắt buộc chứa trường `version INT DEFAULT 1` phục vụ Optimistic Concurrency Control (OCC) nhằm phát hiện xung đột ghi đồng thời (<16ms).
4. **Flexible JSONB**: Các thuộc tính mở rộng hoặc linh hoạt phải lưu dưới dạng `JSONB`.
5. **Migration Safety**: Chạy `serverpod create-migration` để tạo migration sạch, không làm đứt gãy khóa ngoại và quan hệ bảng.

---

### 🟡 CỔNG 3: MODEL DEFINITION & MIGRATION GENERATION

Tiến hành cập nhật file định nghĩa `.spy.yaml` và sinh migration Serverpod cho cơ sở dữ liệu PostgreSQL.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi cập nhật Database Schema, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
