---
name: performance
description: Skill kiểm tra và tối ưu hiệu năng Frontend, Backend API và Database query.
---

# Performance Skill

Mục đích: Giám sát và đảm bảo không vượt ngân sách hiệu năng tại [docs/operations_and_quality.md](docs/operations_and_quality.md).

## 📋 CHECKLIST HIỆU NĂNG

- [ ] Phản hồi Kéo - Thả Cây bài học `< 16ms` (60 FPS).
- [ ] Tránh Re-render không cần thiết (Sử dụng React.memo / Zustand selectors).
- [ ] Web Bundle Size initial chunk `< 300KB gzipped`.
- [ ] Database query LTREE `< 20ms`.
