# nodetask

> **High-Performance Hierarchical Document Node & Knowledge Management Monorepo**  
> Built with **React (Vite)**, **Dart (Serverpod Framework)**, **PostgreSQL (`ltree` + `pgvector`)**, **Redis**, **MinIO Object Storage**, and **Flutter**, governed by an automated **AI Agent Governance System (`.agents/` v1.7.0)**.

---

## ⚡ Key Highlights

* **Hierarchical Document Node Engine**: Multi-level document node hierarchy (`Workspace -> Folder -> Document -> Section`) managed via PostgreSQL `ltree` extension and `@dnd-kit` sortable engine with **<16ms Optimistic UI updates**.
* **Notion-Like AST Rich Text Editor**: Integrated **Tiptap AST Editor** for block-based content editing saved as clean JSON AST.
* **Zero-Icon Monochrome UI**: Strict minimalist design philosophy with 0 icon dependencies (`lucide-react`, `react-icons` banned). Relies 100% on high-contrast typography, border tokens, container tokens (`container-fluid`, `container-wide`, `container-editorial`, `container-narrow`, `container-tight`), and text brackets `[ ]`, `[+]`, `[-]`.
* **Native AI Search & RAG Assistant**: Document semantic search and knowledge Q&A assistant powered directly by PostgreSQL **`pgvector`** with HNSW indexing and S3-compatible MinIO object store (**Zero Extra Infra Bloat**).
* **Code-First Serverpod SDK Auto-Generation**: Declarative YAML data models automatically generate type-safe Dart Client SDK (`apps/client/`) & REST RPC endpoints.
* **Script Lifecycle Governance**: Standardized lifecycle for utility scripts with strict classification into **Reusable** (`scripts/reusable/` with `.manifest.yaml`) and **Ephemeral** (`scripts/tmp/` with audit evidence).
* **AI Agent Governance Engine (v1.7.0)**: Built-in automated guardrails, severity-matrix rule verification (`verify.js --strict`), 16 domain skills, execution pipeline, AST CodeGraph dependency tracking, and git pre-commit hooks for AI pair programming.

---

## 🏛️ System Architecture Diagram

```mermaid
flowchart TD
  subgraph ClientTier["1. Client Tier (Multi-Platform)"]
    WebClient["Web Client (React + Vite)\n- Zustand + TanStack Query\n- Tiptap AST Editor + @dnd-kit\n- Zero-Icon Monochrome UI"]
    MobileClient["Mobile Client (Flutter)\n- Riverpod State Management\n- Serverpod Dart Client SDK\n- Offline-Ready Cache"]
  end

  subgraph BackendTier["2. Backend Core Tier (Dart Serverpod Framework)"]
    Gateway["Serverpod RPC & REST Gateway\n- WebSocket Realtime Streams\n- Session Auth & RBAC Guard"]
    
    subgraph Services["Core Domain Services"]
      NodeService["Document Node Engine\n(Hierarchical LTREE & OCC)"]
      AuthService["Authentication & Session\n(JWT, Refresh & Passwordless)"]
      AIOrchestrator["AI Orchestration Engine\n(RAG Pipeline, Router & Quota)"]
      StorageService["S3 Storage Service\n(Presigned SigV4 URLs)"]
      JobWorker["Native FutureCalls Engine\n(Async Task Queue)"]
    end
  end

  subgraph DataTier["3. Data, Cache & Object Storage Tier"]
    Postgres[("PostgreSQL 16\n- ltree (Hierarchical Tree Nodes)\n- pgvector (Vector Embeddings & HNSW)\n- JSONB (Tiptap AST Content)")]
    RedisCache[("Redis Cache\n- Distributed Session Tokens\n- Document Tree Cache\n- AI Quota Metering")]
    MinIOStore[("S3-Compatible Storage (MinIO / R2 / S3)\n- nodetask-uploads / attachments\n- nodetask-avatars / exports")]
  end

  subgraph CloudAITier["4. External Cloud AI Services"]
    LLMProviders["Cloud LLM & Embedding APIs\n(Gemini / OpenAI)"]
    DocAI["Document AI & Vision APIs\n(Google DocAI / Azure Vision)"]
  end

  subgraph GovernanceTier["5. AI Agent Governance Engine (v1.7.0)"]
    GovEngine["Governance & Quality Engine\n- verify.js --strict (15 Core Rules)\n- 16 Specialized Domain Skills\n- CodeGraph AST (codegraph.db)\n- Engram Persistent Memory"]
  end

  WebClient -->|"REST RPC / WebSocket"| Gateway
  MobileClient -->|"Dart Client SDK"| Gateway
  
  Gateway --> AuthService & NodeService & AIOrchestrator & StorageService & JobWorker
  
  NodeService -->|"LTREE Queries & OCC"| Postgres
  NodeService -->|"Cache Invalidation"| RedisCache
  AuthService -->|"Session State"| RedisCache
  AIOrchestrator -->|"Vector Similarity Search"| Postgres
  AIOrchestrator -->|"Model Invocations"| LLMProviders & DocAI
  StorageService -->|"3-Way Presigned Handshake"| MinIOStore
  JobWorker -->|"Background Processing"| Postgres & RedisCache

  BackendTier -.->|"Governed & Verified by"| GovEngine
  ClientTier -.->|"CI/CD Verification Hook"| GovEngine
```

---

## ⚡ Command Matrix

| Command | Working Directory | Description |
|---|---|---|
| `npm run verify` | `./` | Rule Engine Verification in strict mode (`node .agents/scripts/verify.js --strict`) |
| `npm run scan` | `./` | Fallow codebase analyzer for dead-code, clones, cyclomatic complexity & CRAP scores |
| `npm run build:web` | `./` | TypeScript compilation & Vite production build for `apps/web` |
| `npm run check` | `./` | Run verify + web build checks |
| `docker-compose up -d` | `./` | Launch PostgreSQL (`pgvector`, `ltree`), Redis cache & MinIO object store |
| `cd apps/server && dart bin/main.dart` | `apps/server` | Start Dart Serverpod backend server |
| `cd apps/web && npm run dev` | `apps/web` | Start React Vite local development server |
| `codegraph sync` | `./` | Sync monorepo AST dependency graph in `.codegraph/codegraph.db` |

---

## 🚀 Quickstart Guide

### 1. Prerequisites

- **Node.js**: `>= 20.x`
- **Dart SDK**: `>= 3.0.x` & **Serverpod CLI** (`dart pub global activate serverpod_cli`)
- **Docker & Docker Compose**

### 2. Launch Local Environment

```bash
# Step 1: Start PostgreSQL (pgvector & ltree), Redis, and MinIO Object Storage
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

## 📖 Core Documentation Index

For detailed architectural decisions and coding standards, refer to the specs in `docs/`:

* [Architecture Specification](docs/architecture.md) — Master Tech Stack, ADRs, Directory Structures & DDD Invariants
* [Data Models & API Endpoints](docs/data_and_api.md) — Serverpod RPC Endpoints, DB Schemas (`ltree`, `JSONB`, `pgvector`) & System Roles
* [Frontend & UI/UX Specification](docs/frontend_and_ui.md) — Monochrome Design System, Zero-Icon Rule, Container Tokens & Typography
* [Operations, Testing & Quality Budget](docs/operations_and_quality.md) — Ops, Performance Budget (<16ms Dnd), Security & Testing Guidelines
* [Modular Service Specifications](docs/services/) — 12 Independent per-service specs (`docs/services/<service_name>.md`)
* [Modular Frontend Page & Route Specifications](docs/page_routes/) — 20 Independent per-route specs (`docs/page_routes/<route_name>.md`)

---

## 📜 License

MIT © [nvtruongops](https://github.com/nvtruongops)

