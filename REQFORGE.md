# 🏗️ ReqForge-Platform — 企业需求工程平台

> Forked from [dataelement/Clawith](https://github.com/dataelement/Clawith) (Apache 2.0)
> 治理资产来自 SaucyClaw → MCP Server

ReqForge-Platform 在 Clawith（多Agent协作平台）基础上，注入 SaucyClaw 的本体建模、治理约束和证据追溯能力，构建面向企业软件服务的需求工程后端平台。

## 与 Clawith 的关系

| 能力 | Clawith 提供 | ReqForge 扩展 |
|------|------------|-------------|
| 多Agent协作 | ✅ A2A通信 + Agent身份 | — |
| 企业基础设施 | ✅ RBAC + 审计 + 审批 + PostgreSQL | — |
| 本体建模 | — | ✅ ontology-mcp (SaucyClaw) |
| 治理规则 | — | ✅ governance-mcp (SaucyClaw) |
| 证据追溯 | — | ✅ evidence-mcp (SaucyClaw) |
| 文档解析 | — | ⏳ docling-mcp |
| 流程图生成 | — | ⏳ mermaid-mcp |
| 需求分析 | — | ⏳ Skills + REST API |

## 上游同步

```bash
bash scripts/reqforge/sync-upstream.sh --push
```

## 快速开始

```bash
cd /Users/yaochunyang/tools/AIGC/agent/ReqForge-Platform
bash setup.sh    # Clawith 安装
bash restart.sh   # 启动 → http://localhost:3008
```
