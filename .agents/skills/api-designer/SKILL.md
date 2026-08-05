---
name: api-designer
description: Skill thiết kế và kiểm tra API Endpoints chuẩn Serverpod REST/WebSocket contracts.
---

# API Designer Skill

Mục đích: Đảm bảo các API Endpoint tuân thủ chuẩn [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md).

## 📋 CHECKLIST KIỂM TRA API

- [ ] Status Code & Payload tuân thủ định dạng response chuẩn `{ "success": boolean, "data": ... }`.
- [ ] Xử lý lỗi trả về `ServerpodException` với mã error code rõ ràng.
- [ ] Validate dữ liệu đầu vào tại Trust Boundary.
- [ ] Cấu hình WebSocket events đúng chuẩn payload hợp đồng tại [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md).
