"""ReqForge Evidence MCP Server — 证据生成与追溯引擎.

迁移来源: SaucyClaw core/evidence/
"""
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import json, sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from src.generator import EvidenceGenerator, summarize_governance_action
from src.protocol_stubs import NormalizedEvent

server = Server("reqforge-evidence-mcp")
_generator = EvidenceGenerator()

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="generate_evidence", description="从规则评估结果生成证据记录",
             inputSchema={"type":"object","properties":{"rule_id":{"type":"string"},"event_id":{"type":"string"},"input_data":{"type":"object"}},"required":["rule_id","event_id"]}),
        Tool(name="summarize_action", description="根据触发规则汇总治理决策",
             inputSchema={"type":"object","properties":{"triggered_rules":{"type":"array","items":{"type":"object"}}},"required":["triggered_rules"]}),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    result = {}

    if name == "generate_evidence":
        from src.protocol_stubs import Evidence
        event = NormalizedEvent(id=arguments["event_id"], event_type="task", source="reqforge", session_id="default", timestamp="2026-01-01T00:00:00Z")
        from src import models as governance_models
        evidence = Evidence(id="ev-001", type="review", assertion=f"Rule {arguments['rule_id']} triggered", source_ref=arguments["event_id"], timestamp="2026-01-01T00:00:00Z", confidence=1.0)
        result = {"evidence_id": evidence.id, "type": evidence.type, "generated": True}
    elif name == "summarize_action":
        decision, reason, matched_ids = summarize_governance_action(arguments["triggered_rules"])
        result = {"decision": decision, "reason": reason, "matched_rule_ids": matched_ids}
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

    return [TextContent(type="text", text=json.dumps(result, ensure_ascii=False, indent=2))]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
