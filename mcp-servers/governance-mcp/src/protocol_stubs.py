"""Protocol stubs for governance/evidence MCP server (SaucyClaw → ReqForge).

Minimal stubs to replace stores.protocols imports.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class NormalizedEvent:
    id: str
    event_type: str
    source: str
    session_id: str
    timestamp: str
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class Evidence:
    id: str
    type: str
    assertion: str
    source_ref: str
    timestamp: str
    confidence: float = 1.0
    freshness: str | None = None
    verification_status: str | None = None
    applicable_scope: dict[str, Any] | None = None
    contradicted_by: list[str] | None = None
    governance_version: str | None = None
