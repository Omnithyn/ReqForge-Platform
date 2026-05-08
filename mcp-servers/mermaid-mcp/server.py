"""ReqForge Mermaid MCP Server — 流程图/时序图/状态图生成.

将自然语言描述或结构化数据转换为 Mermaid 图表语法。
Agent 调用此工具生成 Mermaid 代码，前端用 mermaid.js 渲染。
"""
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import json, re

server = Server("reqforge-mermaid-mcp")

def generate_flowchart(title: str, steps: list, decisions: list | None = None) -> str:
    """生成业务流程图 (flowchart TD)。"""
    lines = [f"flowchart TD", f"    Start([{title} 开始])"]
    prev = "Start"
    for i, step in enumerate(steps):
        node_id = f"S{i}"
        lines.append(f"    {prev} --> {node_id}[{step}]")
        prev = node_id
    for j, (cond, yes_step, no_step) in enumerate(decisions or []):
        node_id = f"D{j}"
        yes_id = f"Y{j}"
        no_id = f"N{j}"
        lines.append(f"    {prev} --> {node_id}{{{cond}}}")
        lines.append(f"    {node_id} -->|是| {yes_id}[{yes_step}]")
        lines.append(f"    {node_id} -->|否| {no_id}[{no_step}]")
    lines.append(f"    {prev} --> End([结束])")
    return "\n".join(lines)

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="generate_flowchart", description="生成业务流程图(Mermaid flowchart TD)",
             inputSchema={"type":"object","properties":{"title":{"type":"string"},"steps":{"type":"array","items":{"type":"string"}},"decisions":{"type":"array","items":{"type":"object"}}},"required":["title","steps"]}),
        Tool(name="generate_sequence", description="生成系统时序图(Mermaid sequenceDiagram)",
             inputSchema={"type":"object","properties":{"title":{"type":"string"},"participants":{"type":"array","items":{"type":"string"}},"messages":{"type":"array","items":{"type":"object"}}},"required":["title","participants","messages"]}),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    result = {}
    if name == "generate_flowchart":
        title = arguments.get("title", "流程图")
        steps = arguments.get("steps", [])
        decisions = arguments.get("decisions")
        mermaid_code = generate_flowchart(title, steps, decisions)
        result = {"mermaid": mermaid_code, "type": "flowchart"}
    elif name == "generate_sequence":
        title = arguments.get("title", "时序图")
        participants = arguments.get("participants", [])
        messages = arguments.get("messages", [])
        lines = [f"sequenceDiagram", f"    title {title}"]
        for p in participants:
            lines.append(f"    participant {p}")
        for msg in messages:
            src = msg.get("from", "A")
            dst = msg.get("to", "B")
            text = msg.get("text", "")
            lines.append(f"    {src}->>{dst}: {text}")
        mermaid_code = "\n".join(lines)
        result = {"mermaid": mermaid_code, "type": "sequence"}
    else:
        return [TextContent(type="text", text=json.dumps({"status":"error","message":f"Unknown tool: {name}"}, ensure_ascii=False))]

    return [TextContent(type="text", text=json.dumps(result, ensure_ascii=False, indent=2))]

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
