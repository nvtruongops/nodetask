---
name: testing
description: Skill tự động sinh Unit Test, Integration Test và Widget Test cho hệ thống.
---

# Testing Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent tự động sinh Unit Test, Integration Test và Widget Test tuân thủ 100% chiến lược chất lượng tại [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) và đặc tả kịch bản QA tại `docs/services/*.md` hoặc `docs/page_routes/*.md`.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý viết test file khi chưa kiểm tra chiến lược kiểm thử gốc.

```text
[ CỔNG 1: READ QUALITY DOCS ] ──► [ CỔNG 2: TEST SUITE CHECKLIST ] ──► [ CỔNG 3: GENERATE / RUN TESTS ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ QUALITY DOCS FIRST (KHÔNG VIẾT TEST NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi khởi tạo hoặc chỉnh sửa bất kỳ file test nào (`*.test.ts`, `*_test.dart`), AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) - Quy chuẩn Kiểm thử & Tiêu chuẩn Chất lượng hệ thống.
2. 👉 `docs/services/<service_name>.md` (hoặc `docs/page_routes/<route_name>.md`) - Tệp đặc tả chứa kịch bản QA Gherkin (`Given-When-Then`).

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** tạo hoặc sửa file test trước khi có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: MULTI-STACK TEST SUITE CHECKLIST

1. **Web Frontend**: Sinh test suite bằng `Vitest` + `React Testing Library` kiểm thử Component & User Flow.
2. **Backend Serverpod**: Sinh `Dart Unit & Integration Tests` cho Endpoints và Database transaction boundary.
3. **Flutter Mobile**: Sinh `Widget Tests` và `Golden Tests` kiểm thử giao diện thực tế.
4. **Gherkin QA Scenarios Compliance**: Ánh xạ 100% các kịch bản test từ section `Acceptance Criteria & QA Scenarios` trong đặc tả sang mã nguồn test (`Given-When-Then`).
5. **No Test Masking**: Tuyệt đối CẤM nuốt ngoại lệ, comment out hằng số assert hoặc xóa test đang hỏng để đối phó.

---

### 🟡 CỔNG 3: TEST CASE GENERATION & EXECUTION

Tiến hành lập trình các file test và thực thi test runner tương ứng của từng stack.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi sinh và thực thi test suite, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
