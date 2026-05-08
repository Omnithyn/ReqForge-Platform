"""ReqForge Docling MCP Server — 企业文档解析.

将 Docling 的文档解析能力暴露为 MCP 工具。
支持: PDF, DOCX, PPTX, XLSX, HTML, 图片
输出: Markdown, JSON, 章节结构, 表格, 图片路径
"""
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import json, os, tempfile, subprocess, sys

server = Server("reqforge-docling-mcp")

def convert_via_docling(file_path: str) -> dict:
    """使用 python-docling 解析文档到结构化输出。"""
    try:
        from docling.document_converter import DocumentConverter
        converter = DocumentConverter()
        result = converter.convert(file_path)
        markdown = result.document.export_to_markdown()
        doc = result.document

        sections = []
        tables = []
        for item in doc.iterate_items():
            if item.label in ("section_header", "title"):
                sections.append({"level": getattr(item, "level", 1), "text": item.text if hasattr(item, "text") else str(item)})
            elif item.label == "table":
                table_data = []
                if hasattr(item, "export_to_dataframe"):
                    df = item.export_to_dataframe()
                    table_data = df.to_dict(orient="records")
                tables.append({"caption": getattr(item, "caption", ""), "rows": table_data})

        return {
            "markdown": markdown,
            "sections": sections,
            "tables": tables,
            "page_count": getattr(doc, "num_pages", 1),
            "status": "success",
        }
    except ImportError:
        return {"status": "error", "message": "docling not installed. Run: pip install docling"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="parse_document", description="解析企业文档(PDF/Word/PPT/Excel)为结构化 Markdown/JSON",
             inputSchema={"type":"object","properties":{"file_path":{"type":"string","description":"文档的绝对路径"}},"required":["file_path"]}),
        Tool(name="extract_tables", description="从文档中提取表格数据",
             inputSchema={"type":"object","properties":{"file_path":{"type":"string"}},"required":["file_path"]}),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    file_path = arguments.get("file_path", "")
    if not file_path or not os.path.exists(file_path):
        return [TextContent(type="text", text=json.dumps({"status":"error","message":f"File not found: {file_path}"}, ensure_ascii=False))]

    result = {}
    if name == "parse_document":
        result = convert_via_docling(file_path)
    elif name == "extract_tables":
        doc = convert_via_docling(file_path)
        result = {"tables": doc.get("tables", [])}
    else:
        return [TextContent(type="text", text=json.dumps({"status":"error","message":f"Unknown tool: {name}"}, ensure_ascii=False))]

    return [TextContent(type="text", text=json.dumps(result, ensure_ascii=False, indent=2))]

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
