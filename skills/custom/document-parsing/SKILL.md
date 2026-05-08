---
name: document-parsing
description: 解析上传的企业文档，提取章节结构、表格、业务规则和字段定义
mcp_servers: [docling-mcp]
---

# 文档解析工作流

## 适用场景
用户上传业务文档（制度、标书、需求说明书、数据字典）后，需要解析为结构化数据。

## 支持格式
- PDF (.pdf): 制度文档、标书、合同
- Word (.docx): 需求说明书、会议纪要
- Excel (.xlsx): 数据字典、规则表、字段清单
- PowerPoint (.pptx): 方案汇报、业务蓝图

## 工作流
1. 调用 docling-mcp.parse_document 解析文档
2. 提取: 章节层级、表格数据、图片标注
3. 调用 docling-mcp.extract_tables 提取表格
4. 从文本中识别: 业务规则、字段定义、流程步骤
5. 输出: 结构化 JSON (sections + tables + rules + fields)
6. 标注: 解析置信度、需人工确认的段落

## 约束
- 解析结果必须标注来源页码
- 表格提取后保持原始行列结构
- 识别失败的内容标记为"需人工确认"
