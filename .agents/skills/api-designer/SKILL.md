---
name: api-designer
description: Skill thiết kế và kiểm tra API Endpoints chuẩn Serverpod REST/WebSocket contracts.
---

# API Designer Skill

Mục đích: Đảm bảo các API Endpoint tuân thủ chuẩn [docs/data_and_api.md](docs/data_and_api.md) hoặc đặc tả dịch vụ độc lập tương ứng tại `docs/services/<service_name>.md`.

## 📋 CHECKLIST KIỂM TRA API

- [ ] Status Code & Payload tuân thủ định dạng response chuẩn `{ "success": boolean, "data": ... }`.
- [ ] Xử lý lỗi trả về `ServerpodException` với mã error code rõ ràng.
- [ ] Validate dữ liệu đầu vào tại Trust Boundary.
- [ ] Cấu hình WebSocket events đúng chuẩn payload hợp đồng tại [docs/data_and_api.md](docs/data_and_api.md) hoặc `docs/services/<service_name>.md`.
- [ ] Tuyệt đối KHÔNG sử dụng Mock Data, fake roles hay dummy responses trong contract specs. Tham chiếu 100% System Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`) từ `docs/services/*.md`.

