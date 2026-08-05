---
name: architecture-guardian
description: Skill "Kiến trúc sư trưởng" kiểm soát và ngăn chặn AI Agent tự ý đổi stack, đổi thư viện, đổi cấu trúc thư mục hoặc refactor bừa bãi.
---

# Architecture Guardian Skill (Kiến trúc sư trưởng)

Mục đích của skill này là bảo vệ tính toàn vẹn của hệ thống kiến trúc đã chốt.

## 🚨 QUY TẮC CỐ ĐỊNH

Tất cả các quy tắc bắt buộc tuân thủ được định nghĩa tại [AGENTS.md](.agents/AGENTS.md) và tài liệu kiến trúc [docs/architecture.md](docs/architecture.md).

1. **KHÔNG ĐỔI STACK:** FE: React + Vite, BE: Serverpod (Dart), Mobile: Flutter.
2. **KHÔNG ĐỔI THƯ VIỆN:** Chỉ dùng package trong `docs/architecture.md`.
3. **KHÔNG ĐỔI FOLDER:** Tuân thủ cấu trúc trong `docs/architecture.md`.
4. **KHÔNG REFACTOR TỰ Ý:** Chỉ làm đúng phạm vi task. Không sửa code cũ không liên quan.
5. **VERIFY TỰ ĐỘNG:** Chạy `.agents/scripts/verify.js` để kiểm tra trước khi hoàn tất task.
