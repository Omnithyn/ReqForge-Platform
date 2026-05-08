"""ReqForge Requirements API."""
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.reqforge import ReqForgeRequirement

router = APIRouter(prefix="/requirements", tags=["reqforge-requirements"])

class ReqCreate(BaseModel):
    project_id: str; title: str; req_type: str = "functional"
    priority: str = "medium"; description: str | None = None; source_ref: str | None = None

class ReqResponse(BaseModel):
    id: str; title: str; req_type: str; priority: str; status: str; source_ref: str | None; created_at: str | None
    class Config: from_attributes = True

@router.get("", response_model=list[ReqResponse])
async def list_requirements(
    project_id: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(ReqForgeRequirement).where(ReqForgeRequirement.tenant_id == user.tenant_id)
    if project_id: q = q.where(ReqForgeRequirement.project_id == project_id)
    result = await db.execute(q)
    reqs = result.scalars().all()
    return [{"id": str(r.id), "title": r.title, "req_type": r.req_type or "functional", "priority": r.priority, "status": r.status or "draft", "source_ref": r.source_ref, "created_at": str(r.created_at) if r.created_at else None} for r in reqs]

@router.post("", response_model=ReqResponse)
async def create_requirement(
    data: ReqCreate, user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    req = ReqForgeRequirement(
        id=uuid.uuid4(), project_id=data.project_id, tenant_id=user.tenant_id,
        title=data.title, req_type=data.req_type, priority=data.priority,
        description=data.description, source_ref=data.source_ref, created_by=user.id,
    )
    db.add(req)
    await db.commit()
    return {"id": str(req.id), "title": req.title, "req_type": req.req_type or "functional", "priority": req.priority, "status": req.status or "draft", "source_ref": req.source_ref, "created_at": str(req.created_at) if req.created_at else None}
