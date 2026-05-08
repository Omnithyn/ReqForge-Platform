---
name: api-spec-generation
description: 从需求分析和数据字典中生成 OpenAPI 接口草案
mcp_servers: [ontology-mcp]
---

# OpenAPI 接口草案生成工作流

## 适用场景
需求分析和数据字典确定后，需要生成 API 接口草案。

## 工作流
1. 读取需求中的接口相关描述和数据字段定义
2. 识别: RESTful 资源路径、HTTP 方法、请求参数、响应结构
3. 生成 OpenAPI 3.0 YAML/JSON 格式的接口定义
4. 标注: 接口编码、责任人、鉴权方式
5. 关联: 接口 ↔ 需求对象 ↔ 数据字段

## 约束
- 接口命名遵循 RESTful 规范
- 响应结构统一: { code, message, data }
- 错误码必须定义
