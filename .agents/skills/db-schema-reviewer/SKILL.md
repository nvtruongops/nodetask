---
name: db-schema-reviewer
description: Skill kiểm tra và đánh giá thiết kế Schema Database, Migration, LTREE và OCC Versioning.
---

# DB Schema Reviewer Skill

Mục đích: Đảm bảo thiết kế Database tuân thủ quy chuẩn [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md).

## 📋 CHECKLIST KIỂM TRA DATABASE

- [ ] File YAML model nằm trong `apps/server/lib/src/models/`.
- [ ] Bảng cây phân cấp sử dụng đường dẫn `LTREE` và chỉ mục `GIST`.
- [ ] Bảng có trường `version INT DEFAULT 1` cho Optimistic Concurrency Control (OCC).
- [ ] Các trường linh hoạt được lưu dưới dạng `JSONB`.
- [ ] Chạy `serverpod create-migration` kiểm tra không đứt gãy quan hệ bảng.
