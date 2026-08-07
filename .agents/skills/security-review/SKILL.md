---
name: security-review
description: Skill kiểm tra an toàn thông tin, bảo mật Token, CSRF, XSS, SQLi và Audit Logging.
---

# Security Review Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent kiểm tra an toàn thông tin, rà soát lỗ hổng bảo mật tuân thủ 100% tiêu chuẩn tại [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) và ma trận phân quyền RBAC tại `docs/services/*.md`.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý sửa code an ninh khi chưa rà soát tiêu chuẩn bảo mật.

```text
[ CỔNG 1: READ SECURITY DOCS ] ──► [ CỔNG 2: SECURITY & RBAC CHECKLIST ] ──► [ CỔNG 3: AUDIT / FIX VULNERABILITY ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ SECURITY DOCS FIRST (KHÔNG AUDIT NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi thực hiện rà soát hoặc sửa chữa lỗ hổng bảo mật, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) - Tiêu chuẩn Bảo mật An toàn Thông tin & Audit Logging.
2. 👉 `docs/services/<service_name>.md` - Ma trận phân quyền RBAC và ranh giới dữ liệu cụ thể.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** can thiệp mã nguồn bảo mật trước khi có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: SECURITY & RBAC CHECKLIST

1. **Session & Token Storage**: Session Token BẮT BỘC lưu trong `HttpOnly`, `SameSite=Strict` Cookie (Web) hoặc `FlutterSecureStorage` (Mobile). CẤM lưu token nhạy cảm trong `localStorage`.
2. **Input Sanitization & Injection Prevention**: Mọi dữ liệu đầu vào tại Trust Boundary phải qua hàm Validate Sanitizer (chống XSS, SQL Injection, Command Injection).
3. **RBAC Enforcement**: Phân quyền nghiêm ngặt ở từng API Endpoint dựa trên 5 System Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`). CẤM bỏ qua kiểm tra quyền sở hữu tài nguyên.
4. **Audit Logging**: Ghi vết nhật ký thao tác đối với các hành động nhạy cảm (Đổi mật khẩu, Phân quyền, Xóa dữ liệu).

---

### 🟡 CỔNG 3: VULNERABILITY AUDIT & REMEDIATION

Tiến hành khắc phục lỗ hổng bảo mật hoặc gia cố mã nguồn theo đúng khuyến nghị kỹ thuật.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi hoàn tất khắc phục bảo mật, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
