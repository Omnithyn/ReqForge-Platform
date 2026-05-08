"""Apache AGE Graph Query Service.

图查询能力:
- 本体关系图遍历 (追溯链、影响分析)
- 变更影响范围查询
- 语义检索扩展

注意: AGE 需要 PostgreSQL + AGE 扩展。Docker 部署方式见 docs/age-setup.md
"""
from typing import Any


class AGEGraphService:
    """Apache AGE 图查询服务。"""

    def __init__(self, connection_string: str | None = None):
        self.conn_string = connection_string or "postgresql://clawith:clawith@localhost:5432/clawith"
        self.graph_name = "reqforge_ontology"
    
    async def _query(self, cypher: str) -> list[dict]:
        """执行 Cypher 查询（需要 AGE 扩展）。"""
        try:
            import psycopg2
            conn = psycopg2.connect(self.conn_string)
            cur = conn.cursor()
            cur.execute(f"SET search_path TO ag_catalog, public; SELECT * FROM cypher('{self.graph_name}', $$ {cypher} $$) AS (result agtype);")
            rows = cur.fetchall()
            cur.close()
            conn.close()
            return [{"result": r[0]} for r in rows]
        except ImportError:
            return [{"error": "psycopg2 not installed"}]
        except Exception as e:
            return [{"error": str(e)}]

    async def create_graph(self):
        """创建图空间。"""
        try:
            import psycopg2
            conn = psycopg2.connect(self.conn_string)
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute(f"CREATE EXTENSION IF NOT EXISTS age; LOAD 'age'; SET search_path TO ag_catalog; SELECT create_graph('{self.graph_name}');")
            conn.close()
            return {"status": "created"}
        except Exception as e:
            return {"error": str(e)}

    async def trace_impact(self, entity_type: str, entity_id: str) -> list[str]:
        """追溯影响范围: 从实体出发，沿 IMPACTS/USES/COVERS 边遍历。"""
        cypher = f"""
            MATCH (n:{entity_type} {{id: '{entity_id}'}})-[r:IMPACTS|USES|COVERS*1..5]->(m)
            RETURN DISTINCT labels(m) as type, m.id as id
        """
        results = await self._query(cypher)
        return [f"{r['result']}" for r in results if 'error' not in r]

    async def trace_requirement_chain(self, requirement_id: str) -> dict:
        """追溯需求全链路: 文档→需求→规则→字段→接口→测试。"""
        cypher = f"""
            MATCH (doc:Document)-[:SOURCE_OF]->(req:Requirement {{id: '{requirement_id}'}})
            OPTIONAL MATCH (req)-[:HAS_RULE]->(rule:BusinessRule)
            OPTIONAL MATCH (rule)-[:CONSTRAINS]->(field:DataField)
            OPTIONAL MATCH (field)-[:USES]->(api:API)
            OPTIONAL MATCH (rule)-[:COVERS]->(test:TestCase)
            RETURN doc, req, rule, field, api, test
        """
        return {"trace": await self._query(cypher)}

    async def find_impacted(self, change_type: str, change_id: str) -> dict:
        """变更影响分析: 某个实体变更后，影响哪些其他实体。"""
        cypher = f"""
            MATCH (c:{change_type} {{id: '{change_id}'}})
            OPTIONAL MATCH (c)-[:IMPACTS]->(api:API)
            OPTIONAL MATCH (c)-[:IMPACTS]->(test:TestCase)
            OPTIONAL MATCH (c)-[:IMPACTS]->(page:Page)
            RETURN DISTINCT labels(api) as impacted
        """
        results = await self._query(cypher)
        return {"change_id": change_id, "impacted": [r["result"] for r in results if 'error' not in r]}
