---
name: hook-after-edit
description: Hook kích hoạt ngay sau khi AI chỉnh sửa code trong dự án.
---

# Hook: After Edit

Sau khi chỉnh sửa file code:
1. Tự kiểm tra Import Order theo [docs/operations_and_quality.md](docs/operations_and_quality.md).
2. Kiểm tra không lỡ import thư viện Icon (tuân thủ `minimalist-no-icon-ui`).
3. Chạy linter & formatter kiểm tra cú pháp (hoặc `.agents/scripts/verify.js`).
