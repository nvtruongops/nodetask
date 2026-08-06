# Monorepo AI Agent Governance (Single Source of Truth)

---

## 🚨 I. BỘ QUY TẮC CỐ ĐỊNH (ENTRY GUARDRAILS)

1. **STACK LOCK**: Frontend: **React + Vite + Tailwind CSS + Shadcn UI** | Backend: **Dart (Serverpod)** | Mobile: **Flutter**. Nghiêm cấm đổi stack.
2. **NO UNAPPROVED DEPENDENCIES**: Tham chiếu whitelist tại [`docs/architecture.md`](../docs/architecture.md) & [`.agents/policies/dependencies.json`](policies/dependencies.json).
3. **ZERO-ICON UI RULE**: Tuyệt đối không dùng Icon/Emoji. Chi tiết: [`.agents/skills/minimalist-no-icon-ui/SKILL.md`](skills/minimalist-no-icon-ui/SKILL.md).
4. **BACKWARD COMPATIBILITY**: Tuân thủ API Endpoints & Schema trong [`docs/data_and_api.md`](../docs/data_and_api.md).
5. **PONYTAIL LAZY SENIOR DEV MODE**: Minimum diff, YAGNI, 0 bloat. Chi tiết: [`.agents/skills/ponytail/SKILL.md`](skills/ponytail/SKILL.md).
6. **READ DOCS FIRST**: Tra cứu `docs/architecture.md`, `docs/data_and_api.md`, `docs/frontend_and_ui.md`, `docs/services/*.md`, `docs/page_routes/*.md`.
7. **NO GUESSWORK**: Đọc code $\rightarrow$ Đọc docs $\rightarrow$ Tra CodeGraph $\rightarrow$ Mới tiến hành sửa.
8. **MANDATORY VERIFICATION**: Mọi task BẮT BỘC PASS `node .agents/scripts/verify.js --strict` (0 Error, 0 Warning).
9. **REUSE ROOT SOURCE**: Không duplicate logic, sửa tận gốc caller.
10. **NO MOCK DATA**: 100% Data Models & Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`) từ [`docs/data_and_api.md`](../docs/data_and_api.md).

---

## 🔄 II. ENTERPRISE EXECUTION PIPELINE

```text
User Request ──► Context Resolver ──► Intent Router ──► Skills & Policies ──► Execution ──► verify.js --strict
```

1. **Context & Intent Resolution**: Chạy `node .agents/scripts/context-resolver.js --request "<request>"` để lọc Intent, Capability Matrix & Priority Skills.
2. **Method & Skill Selection**: Gọi skill phù hợp (`using-superpowers`, `brainstorming` cho feature, `systematic-debugging` cho bug).
3. **Planning Phase**: Lập kế hoạch chi tiết `implementation_plan.md` cho các thay đổi phức tạp.
4. **Conditional CodeGraph Traversal**: Tra cứu `.codegraph/graph.db` khi refactor, rename, move, delete hoặc ảnh hưởng liên-file.
5. **Ponytail Implementation**: Sửa mã nguồn tối giản, không bloat, zero icon.
6. **Automated Verification**: Chạy `node .agents/scripts/verify.js --strict` và xác nhận PASS trước khi tuyên bố hoàn thành.

---

## 📁 GOVERNANCE SYSTEM REFERENCES
- **Policies Index**: [`.agents/policies/`](policies/)
- **Skills Registry**: [`.agents/registry.json`](registry.json) & [`.agents/skills/`](skills/)
- **Pipeline Config**: [`.agents/pipeline.json`](pipeline.json)
- **Context Resolver CLI**: [`.agents/scripts/context-resolver.js`](scripts/context-resolver.js)
