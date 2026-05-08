"""ReqForge Ontology API."""
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.reqforge import ReqForgeOntologyType, OntologyScope

router = APIRouter(prefix="/ontology", tags=["reqforge-ontology"])

class OntologyTypeCreate(BaseModel):
    name: str; category: str = "entity"; scope: str = "global"
    project_id: str | None = None; properties: dict | None = None

class OntologyTypeResponse(BaseModel):
    id: str; name: str; category: str; scope: str; project_id: str | None; created_at: str | None
    class Config: from_attributes = True

@router.get("/types", response_model=list[OntologyTypeResponse])
async def list_types(
    scope: str | None = None, project_id: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(ReqForgeOntologyType).where(ReqForgeOntologyType.tenant_id == user.tenant_id)
    if scope: q = q.where(ReqForgeOntologyType.scope == scope)
    if project_id: q = q.where(ReqForgeOntologyType.project_id == project_id)
    result = await db.execute(q)
    types = result.scalars().all()
    return [{"id": str(t.id), "name": t.name, "category": t.category or "entity", "scope": t.scope.value if t.scope else "global", "project_id": str(t.project_id) if t.project_id else None, "created_at": str(t.created_at) if t.created_at else None} for t in types]

@router.post("/types", response_model=OntologyTypeResponse)
async def create_type(
    data: OntologyTypeCreate, user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ot = ReqForgeOntologyType(
        id=uuid.uuid4(), tenant_id=user.tenant_id, name=data.name,
        category=data.category, scope=OntologyScope(data.scope),
        project_id=data.project_id, properties=data.properties,
    )
    db.add(ot)
    await db.commit()
    return {"id": str(ot.id), "name": ot.name, "category": ot.category or "entity", "scope": ot.scope.value if ot.scope else "global", "project_id": str(ot.project_id) if ot.project_id else None, "created_at": str(ot.created_at) if ot.created_at else None}
