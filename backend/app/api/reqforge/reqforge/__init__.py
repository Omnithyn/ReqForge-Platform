"""ReqForge REST API — enterprise requirement engineering.

All endpoints are tenant-scoped via get_current_user.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/reqforge", tags=["reqforge"])

from app.api.reqforge import projects, documents, requirements, ontology, artifacts  # noqa: E402
router.include_router(projects.router)
router.include_router(documents.router)
router.include_router(requirements.router)
router.include_router(ontology.router)
router.include_router(artifacts.router)

@router.get("/status")
async def reqforge_status():
    return {"status": "ok", "version": "0.2.0", "mcp_servers": ["ontology", "governance", "evidence", "docling", "mermaid"]}
