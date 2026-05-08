"""ReqForge Documents API."""
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.reqforge import ReqForgeDocument, DocumentStatus

router = APIRouter(prefix="/documents", tags=["reqforge-documents"])

class DocumentResponse(BaseModel):
    id: str; title: str; doc_type: str; version: str; status: str; created_at: str | None
    class Config: from_attributes = True

@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    project_id: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(ReqForgeDocument).where(ReqForgeDocument.tenant_id == user.tenant_id)
    if project_id: q = q.where(ReqForgeDocument.project_id == project_id)
    result = await db.execute(q)
    docs = result.scalars().all()
    return [{"id": str(d.id), "title": d.title, "doc_type": d.doc_type or "unknown", "version": d.version, "status": d.status.value if d.status else "pending", "created_at": str(d.created_at) if d.created_at else None} for d in docs]

@router.post("", response_model=DocumentResponse)
async def create_document(
    project_id: str = Form(...), title: str = Form(...), doc_type: str = Form("markdown"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = ReqForgeDocument(
        id=uuid.uuid4(), project_id=project_id, tenant_id=user.tenant_id,
        title=title, doc_type=doc_type, status=DocumentStatus.PENDING,
        uploaded_by=user.id,
    )
    db.add(doc)
    await db.commit()
    return {"id": str(doc.id), "title": doc.title, "doc_type": doc.doc_type or "unknown", "version": doc.version, "status": doc.status.value if doc.status else "pending", "created_at": str(doc.created_at) if doc.created_at else None}
