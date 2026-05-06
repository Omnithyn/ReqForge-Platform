---
name: requirement-analysis
description: 从企业业务文档中分析和抽取需求，建立本体模型，输出结构化需求说明
mcp_servers: [docling-mcp, ontology-mcp, governance-mcp, mermaid-mcp]
---

# 需求分析工作流

面向保险、金融、政务等行业应用的需求工程场景。

## 适用场景

用户上传业务文档（制度、标书、需求说明书、会议纪要）并请求需求分析时使用。

## 工作流

### 1. 文档解析
调用 `docling-mcp.parse_document` 解析上传文档，提取章节结构、表格数据、业务规则。

### 2. 需求抽取
从解析结果中识别功能需求、非功能需求、业务规则、约束条件。每个需求标注来源文档和段落。

### 3. 本体建模
调用 `ontology-mcp.map_event_to_ontology` 建立业务对象（业务主体、对象、流程、字段、接口）。调用 `ontology-mcp.establish_facts` 建立对象间关系。

### 4. 流程可视化
调用 `mermaid-mcp.generate_flowchart` 生成业务流程图。

### 5. 质量检查
调用 `governance-mcp.match_rules` 检查需求完整性、一致性、可追溯性。

### 6. 输出汇总
生成研发准备包的需求分析部分：需求清单、本体对象、流程图、评审结果、待确认事项。

## 输出规范

```json
{
  "document_id": "doc-001",
  "requirements": [
    {
      "id": "REQ-001",
      "type": "functional",
      "description": "...",
      "source": {"document": "doc-001", "section": "3.2", "page": 5},
      "related_rules": ["RULE-001"],
      "related_objects": ["保单", "批单"],
      "priority": "high"
    }
  ],
  "business_objects": [],
  "flowcharts": [],
  "quality_review": {
    "completeness_score": 0.0,
    "pending_items": []
  }
}
```

## 约束

- AI 生成的需求必须标注来源文档和段落
- 字段定义必须引用数据字典，无字典则标记为"待确认"
- 所有输出必须经过 governance-mcp 质量检查
- 待确认项必须列出并等待用户回应
