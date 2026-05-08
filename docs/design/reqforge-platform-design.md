# ReqForge-Platform 总体设计

> 版本: v1.0 | 日期: 2026-04-30 | 作者: 姚春阳
>
> 本文档合并了《交互式需求设计与知识工程平台设计文档》与多轮架构讨论的最终结论。

---

## 一、项目本质

ReqForge-Platform = **Clawith (多Agent协作底座)** + **SaucyClaw (治理资产)** = **企业需求工程平台**

| 来源 | 角色 | 许可证 |
|------|------|--------|
| Clawith (dataelement/Clawith) | 多Agent协作、RBAC、审计、审批、PostgreSQL、IM | Apache 2.0 |
| SaucyClaw (已迁移) | 本体建模、治理规则、证据追溯 | MIT |
| DeerFlow (借鉴) | LangGraph checkpointing、Sandbox、部分Skills模式 | MIT |

## 二、分支与仓库

```
upstream (dataelement/Clawith)
  → main (永远等于 upstream/main，零改动)
  → feat/reqforge-platform (所有开发，只 rebase)

GitHub: https://github.com/Omnithyn/ReqForge-Platform
本地: /Users/yaochunyang/tools/AIGC/agent/ReqForge-Platform
```

## 三、总体架构

```
┌──────────────────────────────────────────────────────────────────┐
│                   ReqForge-Platform                               │
│                                                                  │
│  前端层:                                                          │
│  ├── Clawith 管理后台 (3008): Agent+用户+审批+审计 (复用不改)       │
│  └── ReqForge 工作台 (3001): 13页企业需求工作台 (全新自研)          │
│                                                                  │
│  后端层 (Clawith FastAPI 8008):                                    │
│  ├── 原生: 认证/RBAC/Agent/A2A/审批/审计/WebSocket/MCP/Skills     │
│  └── 扩展: /api/v1/reqforge/* (新增router, 不改上游)               │
│                                                                  │
│  AI 基础设施:                                                      │
│  ├── Agent 循环: Clawith WebSocket + Checkpointing (借鉴 DeerFlow) │
│  ├── Sandbox: Docker隔离 (借鉴 DeerFlow)                          │
│  └── MCP Servers: 5个 (3个已迁移, 2个待实现)                       │
│                                                                  │
│  数据层: PostgreSQL (Clawith) + Apache AGE (图关系) + Redis (缓存)  │
└──────────────────────────────────────────────────────────────────┘
```

## 四、核心业务流程

```
用户上传文档 + 源码仓库
    │
    ▼
项目初始化 → 文档解析中心 (docling-mcp)
    │           │ PDF/Word → Markdown/JSON
    │           │ 源码 → AST分析 → API清单/数据模型
    ▼           ▼
需求抽取 (Lead Agent + requirement-analysis skill)
    │ 功能需求、非功能需求、业务规则
    ▼
本体建模 (ontology-mcp) —— 三层本体
    │ L1 全局行业本体 → L2 项目专属本体 → L3 项目实例
    ▼
┌──────────────────────────────────────┐
│  并行分支:                            │
│  ├── 流程图生成 (mermaid-mcp)         │
│  ├── 接口草案生成 (Lead Agent)        │
│  ├── 数据字典生成 (Lead Agent)        │
│  └── 测试用例生成 (Lead Agent)        │
└──────────────────────────────────────┘
    │
    ▼
质量评审 (governance-mcp)
    │ 评分 → 审批工作流 (Clawith) → 人工确认
    ▼
研发准备包: PRD + 流程图 + 原型 + 数据结构 + API + 测试 + 追溯矩阵 + 任务包
    └── 导出 / 流转至开发
```

## 五、本体分层设计

### 5.1 三层架构

```
L1 全局行业本体层 (跨项目共享，只增不改)
    │ 核心概念: 保单、批单、赔案、标的、险种、责任、保费、佣金
    │ 核心流程: 投保、核保、缴费、出单、批改、报案、理赔、结案
    │ 领域子本体: 车险 / 财险 / 寿险 / 健康险 / 团险 (过滤视图)
    │ 维护者: 行业专家 + 架构师 | 存储: PostgreSQL global_ontology schema
    │
    ├── 继承 ──→
    │
L2 项目专属本体层 (每项目独立，可扩展/覆盖)
    │ "智慧理赔平台": 继承全局 + 新增: 材料审核请求、OCR结果、风险评分
    │ "车险核心系统": 继承全局 + 新增: 批改申请、批改项、批单生成、保费重算
    │ 维护者: 项目组 | 存储: PostgreSQL project_{id} schema
    │
    ├── 实例化 ──→
    │
L3 项目实例层 (当前项目的具体资产)
    │ REQ-001 → 来源文档 P3 → 规则 BR-0001
    │ claim_no → 对象 Claim → API /audit 使用
    │ TC-001 → 覆盖规则 BR-0001 → 验证 claim_no 非空
    │ 维护者: AI Agent + 人工确认 | 存储: PostgreSQL + Apache AGE
```

### 5.2 层间关系

| 关系 | 说明 | AGE Cypher |
|------|------|-----------|
| 继承 | 项目自动拥有全局定义 | `(:ProjectOntology)-[:INHERITS]->(:GlobalOntology)` |
| 扩展 | 项目新增特有概念 | `(:ProjectOntology)-[:EXTENDS {reason}]->(:GlobalOntology)` |
| 覆盖 | 项目修改全局属性 | `(:ProjectOntology)-[:OVERRIDES {field, reason}]->(:GlobalOntology)` |
| 实例化 | 需求/规则/字段是本体实例 | `(:Requirement)-[:INSTANCE_OF]->(:OntologyType)` |

### 5.3 图关系（Apache AGE）

```
需求追溯链:
  (:Document)-[:SOURCE_OF]->(:Requirement)
  (:Requirement)-[:HAS_RULE]->(:BusinessRule)
  (:BusinessRule)-[:CONSTRAINS]->(:DataField)
  (:DataField)-[:BELONGS_TO]->(:BusinessObject)
  (:Page)-[:DISPLAYS]->(:DataField)
  (:API)-[:USES]->(:DataField)
  (:TestCase)-[:COVERS]->(:BusinessRule)

变更影响链:
  (:Change)-[:IMPACTS]->(:API)
  (:Change)-[:IMPACTS]->(:TestCase)
```

### 5.4 本体落地路径

| 阶段 | 触发条件 | 实现 | 产出 |
|------|---------|------|------|
| 自动抽取 | 文档解析完成 | ontology-mcp + LLM 提示词 | 本体候选集 (待确认) |
| 专家确认 | 业务专家审阅 | 工作台交互界面 | 已确认本体子图 |
| 持续沉淀 | 项目迭代 | 变更事件 → 更新 AGE 图 | 领域本体知识库 |

## 六、研发准备包

| 层次 | 成果物 | 说明 |
|------|--------|------|
| **需求层** | PRD 说明书、功能需求清单、非功能需求、业务规则清单 | 带来源追溯 |
| **设计层** | 页面原型设计、组件交互说明、页面流转关系 | Penpot 集成 |
| | 数据结构设计、ER 关系图、表结构定义、字段字典、索引设计 | 自动提取+人工补充 |
| | 概要设计、系统架构图、模块分解、技术选型 | AI 生成 |
| **实现层** | OpenAPI 接口草案、请求/响应结构、错误码定义 | |
| | 测试用例 (正常/异常/边界)、验收标准 | |
| | 实施任务包 (模块拆解、工时估算、责任人分配) | |
| **追溯层** | 追溯矩阵 (来源→需求→规则→字段→接口→测试) | AGE 图查询生成 |

## 七、输入增强：项目初始化

| 输入类型 | 用途 | Agent |
|---------|------|-------|
| 业务文档 (PDF/Word/PPT/Excel) | 需求抽取的原始材料 | docling-mcp |
| Git 源码仓库 | 提取现有接口、数据模型、模块结构 | code-analyzer Agent |
| OpenAPI/Swagger YAML | 提取接口契约 | Lead Agent |
| DDL/数据字典 Excel | 提取字段定义和数据模型 | Lead Agent |
| 配置文件 | 理解系统架构和技术栈 | Lead Agent |
| 历史需求/PRD | 理解需求演进 | Lead Agent |

## 八、双前端设计

### Clawith 管理后台 (端口 3008) — 复用不改

| 功能 | 用户 |
|------|------|
| Agent 创建/配置 (10个需求工程Agent) | 管理员 |
| 用户/RBAC (业务专家/需求/架构/开发/测试/PMO) | 管理员 |
| 审批工作流配置 | 管理员 |
| 审计日志 | 管理员 |

### ReqForge 工作台 (端口 3001) — 全新自研

| 页面 | 功能 |
|------|------|
| 项目空间 | 项目列表 + 初始化向导 (上传文档/源码/API) |
| 对话工作台 | Chat + 9阶段进度 + 预览面板 |
| 文档中心 | 上传/管理/解析/版本 |
| 知识库 | 6类知识库 + 向量搜索 |
| 本体中心 | 全局本体 + 项目本体 + 关系图可视化 |
| 原型设计 | Penpot 集成 |
| 流程图 | Mermaid 生成 + BPMN 编辑 |
| 接口与数据 | OpenAPI + 数据字典 |
| 测试与验收 | 测试用例 + 覆盖矩阵 |
| 评审中心 | 多角色签署 + 评分卡 |
| 研发准备包 | 完整清单 + 导出 |
| 订阅服务 | 行业资产包 |
| 系统设置 | 项目配置 |

## 九、技术选型

| 层次 | 选型 | 来源 |
|------|------|------|
| 后端框架 | FastAPI + SQLAlchemy 2.0 async | Clawith |
| 数据库 | PostgreSQL + Redis | Clawith |
| 图数据库 | Apache AGE | 新建 |
| Agent 执行 | WebSocket + MCP Client + Checkpointing | Clawith + DeerFlow借鉴 |
| Sandbox | Docker 隔离 | DeerFlow借鉴 |
| MCP Servers | 5个 (3个SaucyClaw迁移 + 2个新建) | SaucyClaw + 自研 |
| Skills | Markdown 渐进式加载 | Clawith + DeerFlow |
| 前端框架 | Next.js 16 + React 19 + TypeScript | 自研 |
| UI 组件 | Ant Design 5 + Tailwind CSS 4 | 自研 |
| 许可证 | Apache 2.0 | Clawith |

## 十、能力来源映射

| 能力 | 来源 | 说明 |
|------|------|------|
| Agent 协作 + RBAC + 审批 + 审计 | Clawith | 原生企业基础设施 |
| Agent WebSocket 循环 | Clawith | 流式响应 |
| MCP Client | Clawith | HTTP transport |
| Checkpointing | 借鉴 DeerFlow | SQLite 轻量实现 |
| Sandbox | 借鉴 DeerFlow | Docker 隔离 |
| 本体引擎 | SaucyClaw → ontology-mcp | 22文件已迁移 |
| 规则引擎 | SaucyClaw → governance-mcp | 已迁移 |
| 证据追溯 | SaucyClaw → evidence-mcp | 已迁移 |
| 文档解析 | 新建 docling-mcp | 待实现 |
| 流程图 | 新建 mermaid-mcp | 待实现 |
