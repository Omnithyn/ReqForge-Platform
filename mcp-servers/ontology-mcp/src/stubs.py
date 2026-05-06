"""Stubs for external type dependencies (SaucyClaw → ReqForge migration).

These types were originally defined in:
  - core/meta_model/models.py (RelationType)
  - stores/protocols.py (Evidence, NormalizedEvent, GateResult, MemoryRecord)

Minimal stubs to keep the migrated code compiling.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class RelationType:
    id: str
    name: str
    description: str = ""
    source_type: str = ""
    target_type: str = ""
    cardinality: str = "1:1"


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


@dataclass(frozen=True)
class GateResult:
    decision: str
    reason: str
    matched_rules: list[str]
    evidence_ids: list[str]
    suggestions: list[str]
