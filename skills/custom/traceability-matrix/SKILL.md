---
name: traceability-matrix
description: 建立需求全链路追溯矩阵（来源文档→需求→规则→字段→接口→测试）
mcp_servers: [evidence-mcp, ontology-mcp]
---

# 追溯矩阵生成工作流

## 适用场景
所有需求分析成果物完成后，需要建立完整的追溯关系链。

## 追溯链
- 来源文档 → 需求对象 (SOURCE_OF)
- 需求对象 → 业务规则 (HAS_RULE)
- 业务规则 → 数据字段 (CONSTRAINS)
- 数据字段 → 接口服务 (USES)
- 业务规则 → 测试用例 (COVERS)
- 变更 → 影响范围 (IMPACTS)

## 工作流
1. 收集所有来源文档、需求、规则、字段、接口、测试
2. 调用 evidence-mcp.generate_evidence 建立证据链
3. 调用 ontology-mcp.query_ontology_graph 查询图关系
4. 生成追溯矩阵表
5. 标注: 已确认/待确认 状态

## 约束
- 每个需求必须至少有一条来源追溯
- 每个业务规则必须至少有一个覆盖测试
- 未建立追溯的资产标记为"待完善"
