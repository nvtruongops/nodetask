# Monorepo AI Agent Governance (Single Source of Truth)

> **Repository**: `nodetask` (Notion-like Task & Course Note Workspace)  
> **Governance Version**: `1.7.0`  
> **Status**: `LOCKED & ENFORCED`

---

## 📚 Key Docs & Single Source of Truth Index

| Document | Path | Purpose |
|---|---|---|
| **Architecture Spec** | [`docs/architecture.md`](../docs/architecture.md) | Master Tech Stack, ADRs, Directory Structures & DDD Invariants |
| **Data & API Spec** | [`docs/data_and_api.md`](../docs/data_and_api.md) | Serverpod RPC Endpoints, DB Schema (`ltree`, `JSONB`, `pgvector`), Error Codes & System Roles |
| **Frontend & UI Spec** | [`docs/frontend_and_ui.md`](../docs/frontend_and_ui.md) | Monochrome Design System, Zero-Icon Rule, Container Tokens & Typography |
| **Operations & Quality** | [`docs/operations_and_quality.md`](../docs/operations_and_quality.md) | Ops, Performance Budget (<16ms Dnd), Security & Testing Guidelines |
| **Services Specs** | [`docs/services/*.md`](../docs/services/) | Independent specification documents per backend service (`auth.md`, `i18n.md`, `design_preferences.md`, etc.) |
| **Page Route Specs** | [`docs/page_routes/*.md`](../docs/page_routes/) | Contract specifications for every frontend route and page |

---

## ⚡ Command Matrix

| Command | Working Directory | Description |
|---|---|---|
| `npm run verify` | `./` | Rule Engine Verification in strict mode (`node .agents/scripts/verify.js --strict`) |
| `npm run scan` | `./` | Fallow codebase analyzer for dead-code, clones, cyclomatic complexity & CRAP scores |
| `npm run build:web` | `./` | TypeScript compilation & Vite production build for `apps/web` |
| `npm run check` | `./` | Run verify + web build checks |
| `docker-compose up -d` | `./` | Launch PostgreSQL (`pgvector`, `ltree`) & Redis cache containers |
| `cd apps/server && dart bin/main.dart` | `apps/server` | Start Dart Serverpod backend server |
| `cd apps/web && npm run dev` | `apps/web` | Start React Vite local development server |
| `codegraph sync` | `./` | Sync monorepo AST dependency graph in `.codegraph/graph.db` |

---

## 🚨 I. BỘ QUY TẮC CỐ ĐỊNH (ENTRY GUARDRAILS)

1. **STACK LOCK**: 
   - **Frontend**: `React` + `Vite` + `Tailwind CSS` + `Shadcn UI` + `Zustand` + `TanStack Query` + `Tiptap` + `@dnd-kit`.
   - **Backend**: `Dart (Serverpod Framework)` + `PostgreSQL (ltree, pgvector)` + `Redis Cache`.
   - **Mobile**: `Flutter (Dart)` reusing Serverpod Dart Client SDK.
   - *Nghiêm cấm tự ý thay đổi stack hoặc cài thêm framework khác.*
2. **NO UNAPPROVED DEPENDENCIES**: Tham chiếu whitelist tại [`docs/architecture.md`](../docs/architecture.md) & [`.agents/policies/dependencies.json`](policies/dependencies.json).
3. **ZERO-ICON UI RULE**: Tuyệt đối không dùng Icon/Emoji (SVG, Lucide, FontAwesome, Emoji Unicode). Giao diện thuần Typography, Monochrome và Text Badges. Chi tiết: [`.agents/skills/minimalist-no-icon-ui/SKILL.md`](skills/minimalist-no-icon-ui/SKILL.md).
4. **CONTAINER TOKENS**: Dùng container tokens chuẩn `container-fluid`, `container-wide`, `container-editorial`, `container-narrow`, `container-tight`. Cấm hardcode `max-w-7xl`.
5. **BACKWARD COMPATIBILITY**: Tuân thủ API Endpoints, WebSocket contracts & Schema trong [`docs/data_and_api.md`](../docs/data_and_api.md).
6. **NO MOCK DATA**: 100% Data Models & Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`) lấy từ [`docs/data_and_api.md`](../docs/data_and_api.md).
7. **PONYTAIL LAZY SENIOR DEV MODE**: Minimum diff, YAGNI, 0 bloat, fix tận gốc root-cause, stdlib/native first. Chi tiết: [`.agents/skills/ponytail/SKILL.md`](skills/ponytail/SKILL.md).
8. **READ DOCS FIRST & NO GUESSWORK**: Đọc code $\rightarrow$ Đọc docs $\rightarrow$ Tra cứu CodeGraph $\rightarrow$ Mới tiến hành sửa.
9. **MANDATORY VERIFICATION**: Mọi thay đổi BẮT BỘC PASS `node .agents/scripts/verify.js --strict` (0 Error, 0 Warning) trước khi hoàn tất.
10. **REUSE ROOT SOURCE**: Không duplicate logic, sửa tận gốc shared helpers/guards thay vì patch riêng lẻ từng caller.
11. **SCRIPT CREATION GOVERNANCE**: Mọi script do Agent tạo ra BẮT BUỘC phân loại rõ thành **REUSABLE** (`scripts/reusable/`) hoặc **EPHEMERAL** (`scripts/tmp/`). Reusable script phải 100% độc lập môi trường (chỉ dùng ENV), không secret, có manifest metadata (`.manifest.yaml`). Ephemeral script phục vụ task hiện tại, được phép chạy nhiều lần trong task ("one-off purpose" != "one execution only"), nhưng phải xóa sau khi xong và lưu Evidence kiểm toán gọn nhẹ tại `.agents/evidence/scripts/YYYY/*.json`. Nghiêm cấm hardcode path cá nhân (`E:\Code\...`, `C:\Users\...`) hoặc fallback sang path cứng. Tái sử dụng ephemeral script liên tục ($\ge 3$ lần hoặc $\ge 2$ tasks) bắt buộc kích hoạt cơ chế **PROMOTE TO REUSABLE**. Chi tiết: [`.agents/skills/script-governance/SKILL.md`](skills/script-governance/SKILL.md).

---

## 🧠 II. CODE INTELLIGENCE & REPO MEMORY

### 1. CodeGraph (`.codegraph`)
- **Database**: `.codegraph/graph.db` lưu trữ toàn bộ AST, symbols, imports và call-edges.
- **Commands**:
  - `codegraph sync`: Cập nhật index đồ thị sau khi thêm/sửa file.
  - `codegraph query <symbol>`: Tìm kiếm định nghĩa hàm, interface, class.
  - `codegraph callers <symbol>` / `codegraph callees <symbol>`: Truy vết luồng gọi hàm.
  - `codegraph impact <symbol>`: Phân tích các file bị ảnh hưởng trước khi refactor.

### 2. Persistent Memory (`.engram`)
- **Config**: [`.engram/config.json`](../.engram/config.json) (`project_name: "nodetask"`).
- **Protocol**: Tự động lưu quyết định kiến trúc, bugfix, cấu hình và convention quan trọng qua MCP tools `mem_save`, `mem_context`, `mem_session_summary`.

### 3. Codebase Analysis & Health (`.fallow`)
- **Analyzer**: `npx fallow` / `npm run scan` phân tích dead code, trùng lặp (clones), độ phức tạp (cyclomatic, cognitive), và điểm số CRAP.
- **Cache**: `.fallow/` lưu trữ `cache.bin`, `churn.bin`, `graph-cache.bin` (được bảo vệ bởi `.fallow/.gitignore`).

---

## 🔄 III. ENTERPRISE EXECUTION PIPELINE

```text
User Request ──► Context Resolver ──► Intent Router ──► Skills & Policies ──► Execution ──► verify.js --strict
```

1. **Context & Intent Resolution**: Chạy `node .agents/scripts/context-resolver.js --request "<request>"` để lọc Intent, Capability Matrix & Priority Skills.
2. **Method & Skill Selection**: Gọi skill phù hợp (`using-superpowers`, `brainstorming` cho feature, `systematic-debugging` cho bug, `ponytail` cho sửa lỗi tối giản).
3. **Planning Phase**: Lập kế hoạch chi tiết `implementation_plan.md` cho các thay đổi phức tạp / multi-step.
4. **Conditional CodeGraph Traversal**: Tra cứu `.codegraph/graph.db` khi refactor, rename, move, delete hoặc ảnh hưởng liên-file.
5. **Ponytail Implementation**: Sửa mã nguồn tối giản, không bloat, zero icon, tuân thủ Monochrome Design System.
6. **Automated Verification**: Chạy `node .agents/scripts/verify.js --strict` và xác nhận PASS trước khi tuyên bố hoàn thành.

---

## 📁 IV. GOVERNANCE SYSTEM REFERENCES

- **Manifest**: [`.agents/manifest.json`](manifest.json)
- **Pipeline Config**: [`.agents/pipeline.json`](pipeline.json)
- **Skills Registry**: [`.agents/registry.json`](registry.json) & [`.agents/skills/`](skills/)
- **Policies Index**: [`.agents/policies/`](policies/)
- **Rules Engine**: [`.agents/scripts/rules/`](scripts/rules/)
- **Verification CLI**: [`.agents/scripts/verify.js`](scripts/verify.js)
- **Context Resolver CLI**: [`.agents/scripts/context-resolver.js`](scripts/context-resolver.js)
