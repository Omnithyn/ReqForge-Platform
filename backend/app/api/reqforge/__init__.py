"""ReqForge REST API routes — enterprise requirement engineering."""
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

router = APIRouter(prefix="/v1/reqforge", tags=["reqforge"])

@router.get("/status")
async def reqforge_status():
    return {"status": "ok", "version": "0.1.0", "mcp_servers": ["ontology", "governance", "evidence", "docling", "mermaid"]}

@router.get("/projects")
async def list_projects(user=Depends(get_current_user)):
    return {"projects": [], "message": "projects CRUD coming soon"}

@router.get("/ontology/types")
async def list_ontology_types(scope: str = "global"):
    return {"types": [], "scope": scope, "message": "ontology CRUD coming soon"}
