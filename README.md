# nodetask

> **High-Performance Hierarchical Document Node & Knowledge Management Monorepo**  
> Built with **React (Vite)**, **Dart (Serverpod Framework)**, **PostgreSQL (`ltree` + `pgvector`)**, and **Flutter**, governed by an automated **AI Agent Governance System (`.agents/`)**.

---

## ⚡ Key Highlights

* **🌳 Hierarchical Document Node Engine**: Multi-level document node hierarchy (`Workspace -> Folder -> Document -> Section`) managed via PostgreSQL `ltree` extension and `@dnd-kit` sortable engine with **<16ms Optimistic UI updates**.
* **📝 Notion-Like AST Rich Text Editor**: Integrated **Tiptap AST Editor** for block-based content editing saved as clean JSON AST.
* **🎨 Zero-Icon Monochrome UI**: Strict minimalist design philosophy with 0 icon dependencies (`lucide-react`, `react-icons` banned). Relies 100% on high-contrast typography, border tokens, and text brackets `[ ]`, `[+]`, `[-]`.
* **🧠 Native AI Search & RAG Assistant**: Document semantic search and knowledge Q&A assistant powered directly by PostgreSQL **`pgvector`** with HNSW indexing (**Zero Extra Infra Bloat**).
* **🔄 Code-First Serverpod SDK Auto-Generation**: Declarative YAML data models automatically generate type-safe Dart & TypeScript client SDKs.
* **🛡️ AI Agent Governance Engine (v1.3.0)**: Built-in automated guardrails, severity-matrix rule verification (`verify.js`), 11 domain skills, execution pipeline, specification validators (`service-doc.yaml` & `page-route-doc.yaml`), and git pre-commit hooks for AI pair programming.

---

## 🏗️ Monorepo Architecture Overview

```text
nodetask/
├── .agents/                      # AI Agent Governance & Rulesets (AGENTS.md, skills, prompts, scripts)
│   ├── manifest.json             # Governance Metadata & Versioning (v1.3.0)
│   ├── pipeline.json             # 6-Stage Execution Pipeline for Manager/Subagents
│   ├── policies/                 # Rule policies (dependencies, folder-structure, zero-icon, imports)
│   └── scripts/verify.js         # Automated AST & pattern rule engine runner
├── docs/                         # Core Architecture Specifications & Service Specs
│   ├── architecture.md           # Master Tech Stack & ADRs
│   ├── data_and_api.md           # Serverpod Endpoints & Database Schemas Index
│   ├── frontend_and_ui.md        # Monochrome Theme Tokens & Zero-Icon UI rules
│   ├── operations_and_quality.md # Quality budgets, testing strategy & phased roadmap
│   ├── services/                 # Modular Per-Service Specifications (`<service_name>.md`)
│   └── page_routes/              # Modular Frontend Page & Route Specs (`<route_name>.md`)
├── apps/                         # Multi-Platform Applications
│   ├── web/                      # React (Vite) Frontend + Zustand + TanStack Query
│   ├── server/                   # Dart Serverpod Backend + PostgreSQL + Redis
│   └── mobile/                   # Flutter Mobile App
└── docker-compose.yml            # Docker setup for PostgreSQL (pgvector) & Redis
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: `>= 20.x`
- **Dart SDK**: `>= 3.0.x` & **Serverpod CLI** (`dart pub global activate serverpod_cli`)
- **Docker & Docker Compose**

### 2. Launch Local Environment

```bash
# Step 1: Start PostgreSQL (pgvector & ltree) and Redis containers
docker-compose up -d

# Step 2: Start Serverpod Backend
cd apps/server
dart bin/main.dart

# Step 3: Start Frontend Web Application
cd apps/web
npm run dev
```

### 3. Enable Git Pre-Commit Rule Verification Hook

Ensure all code changes adhere to AI Agent Governance rules before committing:

```bash
git config core.hooksPath .githooks
```

---

## 🛡️ AI Agent Governance Engine

This repository includes an embedded rule engine runner to verify code against architectural guardrails:

```bash
# Run verification in standard mode
node .agents/scripts/verify.js

# Run verification in strict mode (fails on ERRORS and WARNINGS)
node .agents/scripts/verify.js --strict
```

### Rule Severity Breakdown
* 🔴 **`ERROR`**: Architecture swap, forbidden dependencies, missing core docs or `.agents` structure (Blocks Commit/CI).
* 🟡 **`WARNING`**: Icon package imports or UI guidelines violations (Blocks CI in `--strict` mode).
* 🔵 **`INFO`**: Import order conventions and styling formatting suggestions.

---

## 📖 Core Documentation

For detailed architectural decisions and coding standards, refer to the specs in `docs/`:

* [Architecture Specification](docs/architecture.md)
* [Data Models & API Endpoints](docs/data_and_api.md)
* [Frontend & UI/UX Specification](docs/frontend_and_ui.md)
* [Operations, Testing & Quality Budget](docs/operations_and_quality.md)
* [Modular Service Specifications](docs/services/) - Independent per-service specs (`docs/services/<service_name>.md`)
* [Modular Frontend Page & Route Specifications](docs/page_routes/) - Independent per-route specs (`docs/page_routes/<route_name>.md`)

---

## 📜 License

MIT © [nvtruongops](https://github.com/nvtruongops)
