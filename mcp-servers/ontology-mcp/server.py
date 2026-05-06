"""ReqForge Ontology MCP Server — 本体建模与追溯关系引擎.

迁移来源: SaucyClaw ontology/
"""
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import json, sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from src.schema import OntologySchema
from src.loader import load_ontology_schema
from src.mapping import map_raw_event_to_ontology
from src.establishment import establish_fact_from_event
from src.policy_binding import evaluate_policy_on_ontology

SCHEMA_DIR = os.path.join(os.path.dirname(__file__), "schemas")
_default_schema = None

def get_schema():
    global _default_schema
    if _default_schema is None:
        _default_schema = load_ontology_schema(SCHEMA_DIR)
    return _default_schema

server = Server("reqforge-ontology-mcp")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="map_event_to_ontology", description="将原始事件映射到本体实例",
             inputSchema={"type":"object","properties":{"raw_event":{"type":"object"}},"required":["raw_event"]}),
        Tool(name="establish_facts", description="从事件和实体建立事实记录",
             inputSchema={"type":"object","properties":{"event_instance":{"type":"object"},"entity_instances":{"type":"array","items":{"type":"object"}},"ontology_schema":{"type":"object"}},"required":["event_instance","entity_instances"]}),
        Tool(name="evaluate_policy", description="评估策略绑定在本体实例上的执行结果",
             inputSchema={"type":"object","properties":{"policy_binding":{"type":"object"},"ontology_instances":{"type":"object"}},"required":["policy_binding","ontology_instances"]}),
        Tool(name="query_ontology_graph", description="查询本体关系图",
             inputSchema={"type":"object","properties":{"cypher_query":{"type":"string"}},"required":["cypher_query"]}),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    schema = get_schema()
    result = {}

    if name == "map_event_to_ontology":
        mapping = map_raw_event_to_ontology(arguments["raw_event"], schema)
        result = {"event_type": mapping.event_instance.event_type, "entity_count": len(mapping.entity_instances), "has_context": mapping.context_snapshot is not None}
    elif name == "establish_facts":
        from src.instances import EventInstance, EntityInstance
        ei = EventInstance(**arguments["event_instance"]) if isinstance(arguments["event_instance"], dict) else arguments["event_instance"]
        entities = [EntityInstance(**e) if isinstance(e, dict) else e for e in arguments["entity_instances"]]
        est = establish_fact_from_event(ei, entities, schema)
        result = {"fact_type": est.fact_record.fact_type if est else None, "established": est is not None}
    elif name == "evaluate_policy":
        from src.schema import PolicyBinding
        pb_dict = arguments["policy_binding"]
        pb = PolicyBinding(**pb_dict) if isinstance(pb_dict, dict) else pb_dict
        judgment = evaluate_policy_on_ontology(pb, arguments["ontology_instances"])
        result = {"judgment_result": judgment.judgment_result, "judgment_reason": judgment.judgment_reason}
    elif name == "query_ontology_graph":
        result = {"status": "not_implemented", "backend": "Apache AGE pending"}
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]

    return [TextContent(type="text", text=json.dumps(result, ensure_ascii=False, indent=2))]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
