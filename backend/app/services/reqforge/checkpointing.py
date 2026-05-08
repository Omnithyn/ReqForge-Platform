"""Agent checkpointing — 借鉴 DeerFlow LangGraph 设计.

为 Clawith WebSocket Agent 循环添加状态持久化能力:
- 每步自动保存 checkpoint
- 出错/重启时从最近的 checkpoint 恢复
- 轻量级 SQLite 实现 (与 Clawith PostgreSQL 兼容)
"""
import json
import sqlite3
import threading
from datetime import datetime
from pathlib import Path

CHECKPOINT_DB = Path(__file__).parent / "data" / "agent_checkpoints.db"

class CheckpointManager:
    """Agent 状态 checkpoint 管理器."""
    
    def __init__(self, db_path: str | None = None):
        self.db_path = db_path or str(CHECKPOINT_DB)
        self._lock = threading.Lock()
        self._init_db()
    
    def _init_db(self):
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS checkpoints (
                    id TEXT PRIMARY KEY,
                    agent_id TEXT NOT NULL,
                    thread_id TEXT NOT NULL,
                    step INTEGER NOT NULL,
                    state TEXT NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_checkpoint_lookup ON checkpoints(agent_id, thread_id, step DESC)")
            conn.commit()
    
    def save(self, agent_id: str, thread_id: str, step: int, state: dict) -> str:
        """保存 checkpoint，返回 checkpoint ID。"""
        cid = f"{agent_id}:{thread_id}:{step}"
        with self._lock, sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO checkpoints VALUES (?, ?, ?, ?, ?, datetime('now'))",
                (cid, agent_id, thread_id, step, json.dumps(state, default=str))
            )
            conn.commit()
        return cid
    
    def restore(self, agent_id: str, thread_id: str) -> tuple[dict | None, int]:
        """恢复最近的 checkpoint。返回 (state_dict, step_number)。"""
        with self._lock, sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT state, step FROM checkpoints WHERE agent_id=? AND thread_id=? ORDER BY step DESC LIMIT 1",
                (agent_id, thread_id)
            ).fetchone()
        return (json.loads(row[0]), row[1]) if row else (None, 0)
    
    def list_checkpoints(self, agent_id: str, thread_id: str) -> list[dict]:
        """列出所有 checkpoint。"""
        with self._lock, sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(
                "SELECT id, step, created_at FROM checkpoints WHERE agent_id=? AND thread_id=? ORDER BY step",
                (agent_id, thread_id)
            ).fetchall()
        return [{"id": r[0], "step": r[1], "created_at": r[2]} for r in rows]
