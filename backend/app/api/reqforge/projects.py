"""ReqForge Projects API."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User as UserModel
from app.models.reqforge import ReqForgeProject

router = APIRouter(prefix="/projects", tags=["reqforge-projects"])

class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    business_domain: str | None = None
    tech_stack: str | None = None

class ProjectResponse(BaseModel):
    id: str; name: str; business_domain: str | None; created_at: str | None
    class Config: from_attributes = True

@router.get("", response_model=list[ProjectResponse])
async def list_projects(user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReqForgeProject).where(ReqForgeProject.tenant_id == user.tenant_id))
    projects = result.scalars().all()
    return [{"id": str(p.id), "name": p.name, "business_domain": p.business_domain, "created_at": str(p.created_at) if p.created_at else None} for p in projects]

@router.post("", response_model=ProjectResponse)
async def create_project(data: ProjectCreate, user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    project = ReqForgeProject(id=uuid.uuid4(), tenant_id=user.tenant_id, name=data.name, description=data.description, business_domain=data.business_domain, tech_stack=data.tech_stack, created_by=user.id)
    db.add(project); await db.commit()
    return {"id": str(project.id), "name": project.name, "business_domain": project.business_domain, "created_at": str(project.created_at) if project.created_at else None}

@router.delete("/{project_id}")
async def delete_project(project_id: str, user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(delete(ReqForgeProject).where(ReqForgeProject.id == project_id, ReqForgeProject.tenant_id == user.tenant_id))
    await db.commit()
    return {"status": "deleted"}
