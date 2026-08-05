---
name: security-review
description: Skill kiểm tra an toàn thông tin, bảo mật Token, CSRF, XSS, SQLi và Audit Logging.
---

# Security Review Skill

Mục đích: Đảm bảo mã nguồn tuân thủ tiêu chuẩn bảo mật tại [docs/operations_and_quality.md](docs/operations_and_quality.md) và ma trận phân quyền RBAC tại `docs/services/<service_name>.md`.

## 📋 CHECKLIST BẢO MẬT

- [ ] Session Token được lưu trong `HttpOnly` Cookie (Web) hoặc `FlutterSecureStorage` (Mobile).
- [ ] Mọi đầu vào dữ liệu đều qua hàm Validate Sanitize (chống XSS / Injection).
- [ ] Kiểm tra phân quyền (Role-based authorization) ở từng API Endpoint.
- [ ] Ghi log nhật ký thao tác quan trọng (Audit Log).
