# AGENTS.md — ReqForge-Platform 项目总入口

> 本文件是 AI 代理进入仓库的第一入口。Fork from [dataelement/Clawith](https://github.com/dataelement/Clawith) (Apache 2.0)

## 一、项目本质

ReqForge-Platform = **Clawith (多Agent协作底座)** + **SaucyClaw (治理资产)** = **企业需求工程平台后端**

| 来源 | 角色 | 位置 |
|------|------|------|
| Clawith (上游) | 多Agent协作、RBAC、审计、审批、PostgreSQL、IM | `backend/` `frontend/` `docker/` |
| SaucyClaw (已迁移) | 本体建模、治理规则、证据追溯 | `mcp-servers/ontology-mcp/` `mcp-servers/governance-mcp/` `mcp-servers/evidence-mcp/` |
| ReqForge (新建) | 需求分析流程、文档解析、研发准备包 | `skills/custom/` `mcp-servers/docling-mcp/` `mcp-servers/mermaid-mcp/` `templates/artifacts/` |

## 二、与 ReqForge (deer-flow fork) 的关系

| 项目 | 底座 | 角色 |
|------|------|------|
| **ReqForge** (deer-flow fork) | DeerFlow | 前端 UI 原型 + SaucyClaw 资产源 |
| **ReqForge-Platform** (clawith fork) | Clawith | 正式后端平台 + Agent 运行时 |

ReqForge 的 `frontend-reqforge/` 和 `mcp-servers/` 迁移到本仓库。ReqForge 仓库保留归档。

## 三、分支策略

```
upstream (dataelement/Clawith)
  │
  ├── main  ───────────── [持续更新] ───→
  │   ↑ 定期 git merge
  │
origin (Omnithyn/ReqForge-Platform)
  │
  ├── main  ───────────── 永远等于 upstream/main，零改动
  │
  └── feat/reqforge-platform ── 所有 ReqForge 开发在此分支
                                (只 rebase，不 merge upstream)
```

```bash
# 同步上游最新代码
git checkout main && git fetch upstream && git merge upstream/main && git push origin main
# 更新开发分支
git checkout feat/reqforge-platform && git rebase main
# 或使用脚本
bash scripts/reqforge/sync-upstream.sh
```

## 四、哪里可以改，哪里不能改

### ✅ 可以改
| 目录 | 用途 |
|------|------|
| `mcp-servers/` | MCP Server (本体/治理/证据/文档解析/流程图) |
| `skills/custom/` | ReqForge 领域 Skill |
| `scripts/reqforge/` | 运维脚本 |
| `.reqforge/` | 内部文档 |
| `templates/artifacts/` | 研发准备包模板 |

### ❌ 不能改（上游文件）
| 目录 | 说明 |
|------|------|
| `backend/` | Clawith 后端 (除非必要扩展) |
| `frontend/` | Clawith 前端 (除非必要扩展) |
| `docker/` | Clawith Docker 配置 |
| `helm/` | Clawith Helm Charts |

### ⚠️ 可最小改动（必要时）
Clawith 的扩展点（不会冲突上游）：
- `backend/app/api/` ← 新增 `reqforge/` router 目录
- `backend/app/services/` ← 新增 ReqForge 业务服务
- `backend/app/models/` ← 新增 ReqForge 数据模型
- `config.yaml` ← Clawith 配置中注册 MCP Server

## 五、MCP Server 实现状态

| Server | 代码 | MCP Tools | 来源 |
|--------|------|-----------|------|
| ontology-mcp | ✅ 完整 | map_event_to_ontology, establish_facts, evaluate_policy, query_graph | SaucyClaw |
| governance-mcp | ✅ 完整 | load_rules, match_rules, explain_decisions, quality_review | SaucyClaw |
| evidence-mcp | ✅ 完整 | generate_evidence, summarize_action | SaucyClaw |
| docling-mcp | ⏳ stub | parse_document (待实现) | 新建 |
| mermaid-mcp | ⏳ stub | generate_flowchart (待实现) | 新建 |

## 六、下一步

1. Clawith 底座启动验证 (`bash setup.sh && bash restart.sh`)
2. MCP Server 接入 Clawith（HTTP transport 替代 stdio）
3. reqforge-backend CRUD API（需求/文档/本体/评审）
4. 前端对接 Clawith REST API
5. docling-mcp + mermaid-mcp server.py 实现
6. 端到端 DEMO：文档上传 → 解析 → 本体 → 流程图
