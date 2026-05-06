"""ReqForge Governance MCP Server — 规则匹配与质量评审引擎.

迁移来源: SaucyClaw core/governance/
"""
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import json, sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from src.loader import load_governance, load_rules
from src.matcher import match_rules
from src.explainer_bundle import bundle_explanations

SCHEMA_DIR = os.path.join(os.path.dirname(__file__), "schemas")
_default_schema = None

def get_schema():
    global _default_schema
    if _default_schema is None:
        _default_schema = load_governance(SCHEMA_DIR)
    return _default_schema

server = Server("reqforge-governance-mcp")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="load_rules", description="加载治理规则",
             inputSchema={"type":"object","properties":{"yaml_path":{"type":"string"}},"required":["yaml_path"]}),
        Tool(name="match_rules", description="匹配事件与治理规则",
             inputSchema={"type":"object","properties":{"event_data":{"type":"object"}},"required":["event_data"]}),
        Tool(name="explain_decisions", description="生成规则匹配的结构化解释",
             inputSchema={"type":"object","properties":{"matched_rule_ids":{"type":"array","items":{"type":"string"}},"decision":{"type":"string"}},"required":["matched_rule_ids","decision"]}),
        Tool(name="quality_review", description="需求质量评审",
             inputSchema={"type":"object","properties":{"requirements":{"type":"array","items":{"type":"object"}}}},
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    schema = get_schema()
    result = {}

    if name == "load_rules":
        rules = load_rules(arguments["yaml_path"])
        result = {"rule_count": len(rules), "rule_ids": [r.id for r in rules]}
    elif name == "match_rules":
        triggered = match_rules(schema.rules, arguments["event_data"])
        result = {"triggered_count": len(triggered), "triggered_ids": [r.id for r in triggered], "severities": [r.severity for r in triggered]}
    elif name == "explain_decisions":
        rule_lookup = {r.id: r for r in schema.rules}
        bundle = bundle_explanations(arguments["decision"], arguments["matched_rule_ids"], rule_lookup)
        result = {"readable_summary": bundle.readable_summary, "risk_summary": bundle.risk_summary, "suggestions": bundle.suggestions}
    elif name == "quality_review":
        event_data = {"task_type": "C", "assignee": "specialist", "reviewer": "developer", "direct_output": "true"}
        triggered = match_rules(schema.rules, event_data)
        result = {"completeness_score": 1.0 - len(triggered) * 0.2, "issues": [r.description for r in triggered], "issue_count": len(triggered)}
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

    return [TextContent(type="text", text=json.dumps(result, ensure_ascii=False, indent=2))]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
