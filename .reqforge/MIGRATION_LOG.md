# SaucyClaw → ReqForge 迁移日志

## 2026-04-30 下午: 企业级前端 UI 重写

- frontend-reqforge/ 完全重写为深蓝侧边栏 + 13 导航的企业工作台
- P0 页面完成: 对话工作台（ChatPanel + TaskStepper + PreviewCards + RightPanel）
- P0 页面完成: 研发准备包（评分卡 + 8交付物卡片网格 + 28项任务表）
- 首页仪表盘: 项目统计 + 9阶段进度 + MCP Server 状态
- 8 个骨架页面: documents/knowledge/prototype/flowchart/interface/testing/subscription/settings
- 26 文件变更, 9819 行新增

## 2026-04-30 下午: MCP Server 实际实现

- ontology-mcp/server.py: 调用真实 SaucyClaw 迁移代码（非 stub）
- governance-mcp/server.py: 同上, exists bug 已修复
- evidence-mcp/server.py: 新建, 调用真实 generator

## 2026-04-30 上午: Phase 0 基础框架 + Phase 1 源码迁移

### 迁移内容

**ontology-mcp/ (14 files + schemas)**
- src/schema.py — OntologySchema, EventType, ContextType, FactType, PolicyBinding
- src/instances.py — EntityInstance, EventInstance, ContextSnapshot, FactRecord
- src/facts.py — FactEvidenceBinding, EvidenceChain, FactEstablishment
- src/mapping.py — map_raw_event_to_ontology, map_raw_event_with_package
- src/establishment.py — establish_fact_from_event, establish_fact_with_package
- src/policy_binding.py — evaluate_policy_on_ontology, PolicyJudgment
- src/loader.py — load_ontology_schema, validate_ontology_schema
- src/governance_loop.py — run_ontology_governance_loop, run_package_driven_governance
- src/authoring_package.py — AuthoringPackage, RuntimePackage, CompilationReport
- schemas/ — event_types.yaml, context_types.yaml, fact_types.yaml, studio_manifest.yaml
- src/stubs.py — RelationType stub
- 额外: edge_semantics.py, roundtrip.py, semantic_surface.py, visual_model.py, runtime_readiness.py

**governance-mcp/ (5 files + schemas)**
- src/models.py — Condition, GovernanceRule, RoleDefinition, TaskType
- src/matcher.py — evaluate_rule, match_rules (exists bug FIXED)
- src/loader.py — load_rules, load_roles, load_task_types, load_governance
- src/explainer.py — RuleExplanation, explain_matched_rules
- src/explainer_bundle.py — ExplanationBundle, bundle_explanations
- schemas/ — rules.yaml, roles.yaml, task_types.yaml

**evidence-mcp/ (1 file)**
- src/generator.py — EvidenceGenerator, summarize_governance_action

### Bug 修复
- ✅ matcher.py L31: `exists` 操作符语义错误 — 字段不存在时不再错误返回 True

### Import 路径修复
- ✅ ontology-mcp: `from ontology.xxx → from src.xxx`
- ✅ governance-mcp: `from core.governance.xxx → from src.xxx`
- ✅ evidence-mcp: `from core.governance.models → from src.models`
- ✅ 所有 `from stores.protocols → from src.protocol_stubs`

### 待完成
- ⏳ docling-mcp server.py 实现
- ⏳ mermaid-mcp server.py 实现
- ⏳ DeerFlow 底座启动验证
- ⏳ 端到端集成测试 (PDF → 解析 → 本体 → 流程图)
- ⏳ 更多领域 Skill
