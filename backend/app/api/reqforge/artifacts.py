"""ReqForge Artifacts API."""
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.reqforge import ReqForgeArtifact

router = APIRouter(prefix="/artifacts", tags=["reqforge-artifacts"])

class ArtifactResponse(BaseModel):
    id: str; artifact_type: str; title: str; version: str; status: str; created_at: str | None
    class Config: from_attributes = True

@router.get("", response_model=list[ArtifactResponse])
async def list_artifacts(
    project_id: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(ReqForgeArtifact).where(ReqForgeArtifact.tenant_id == user.tenant_id)
    if project_id: q = q.where(ReqForgeArtifact.project_id == project_id)
    result = await db.execute(q)
    arts = result.scalars().all()
    return [{"id": str(a.id), "artifact_type": a.artifact_type or "unknown", "title": a.title, "version": a.version, "status": a.status or "draft", "created_at": str(a.created_at) if a.created_at else None} for a in arts]

@router.post("", response_model=ArtifactResponse)
async def create_artifact(
    project_id: str, artifact_type: str, title: str, content: dict | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    art = ReqForgeArtifact(
        id=uuid.uuid4(), project_id=project_id, tenant_id=user.tenant_id,
        artifact_type=artifact_type, title=title, content=content,
    )
    db.add(art)
    await db.commit()
    return {"id": str(art.id), "artifact_type": art.artifact_type or "unknown", "title": art.title, "version": art.version, "status": art.status or "draft", "created_at": str(art.created_at) if art.created_at else None}
