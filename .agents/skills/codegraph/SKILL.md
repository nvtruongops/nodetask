---
name: codegraph
description: Hướng dẫn khai thác và đồng bộ CodeGraph MCP Database (./.codegraph/codegraph.db) cho AI Agent trong monorepo nodetask.
---

# CodeGraph MCP Integration Skill

Tài liệu hướng dẫn AI Agent khai thác Đồ thị mã nguồn CodeGraph MCP trong dự án `nodetask`.

---

## 1. Vị Trí Dữ Liệu CodeGraph
- **Database Path**: `./.codegraph/codegraph.db` (SQLite WAL)
- **Git Protection**: Thư mục `.codegraph/` đã được khai báo trong `.gitignore`.

---

## 2. Nguyên Tắc Sử Dụng Cho AI Agent
1. **Khởi Tạo & Đồng Bộ**:
   - Khởi tạo lần đầu: `codegraph init`
   - Đồng bộ sau khi sửa đổi mã nguồn: `codegraph sync`
   - Kiểm tra trạng thái index: `codegraph status`
2. **Truy Vấn Đồ Thị Mã Nguồn (CodeGraph CLI & MCP)**:
   - `codegraph query <symbol>`: Tìm kiếm symbol, function, class, file.
   - `codegraph callers <symbol>` / `codegraph callees <symbol>`: Truy vết luồng gọi hàm.
   - `codegraph impact <symbol>`: Phân tích vùng ảnh hưởng (blast-radius) trước khi refactor.
   - `codegraph_explore` (MCP Tool): Khai thác đồng thời ngữ cảnh, mã nguồn và call path.

