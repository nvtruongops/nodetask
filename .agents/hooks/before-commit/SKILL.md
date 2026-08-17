---
name: hook-before-commit
description: Hook kích hoạt trước khi commit code vào Git repository.
---

# Hook: Before Commit

Trước khi thực hiện commit code:
1. Chạy `node .agents/scripts/verify.js --strict` (Rule Engine Verification).
2. Tự động đồng bộ CodeGraph MCP Database (`npx --yes @astudioplus/codegraph-mcp --workspace "." --graph-only`).
3. Chạy `npm run lint` & `npm run test` (Frontend).
4. Chạy `dart analyze` & `dart test` (Backend).
5. Chạy `flutter analyze` (Mobile).
6. **Nếu bất kỳ kiểm tra nào bị lỗi (Fail) -> KHÔNG COMMIT CODE.**
