---
name: codegraph
description: Hướng dẫn khai thác và đồng bộ CodeGraph MCP Database (./.codegraph/graph.db) cho AI Agent trong monorepo nodetask.
---

# CodeGraph MCP Integration Skill

Tài liệu hướng dẫn AI Agent khai thác Đồ thị mã nguồn CodeGraph MCP trong dự án `nodetask`.

---

## 1. Vị Trí Dữ Liệu CodeGraph
- **Database Path**: `./.codegraph/graph.db`
- **Index State**: `./.codegraph/index_state.json`
- **Git Protection**: Thư mục `.codegraph/` đã được khai báo trong `.gitignore`.

---

## 2. Nguyên Tắc Sử Dụng Cho AI Agent
1. **Trace Luồng Phụ Thuộc**: Trước khi chỉnh sửa hàm hoặc endpoint dùng chung, agent luôn kiểm tra tác động liên-file (cross-file call edges) qua CodeGraph.
2. **Cập Nhật Ngầm**: Khi thực hiện các thay đổi lớn về mã nguồn, khởi chạy daemon ngầm để giữ CodeGraph đồng bộ:
   ```powershell
   $env:CODEGRAPH_DATA_DIR="e:\Code\nodetask\.codegraph"; npx --yes @astudioplus/codegraph-mcp --workspace "e:\Code\nodetask" --graph-only --watch
   ```
