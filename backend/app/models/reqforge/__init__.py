"""ReqForge enterprise requirement engineering models."""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Integer, Float, JSON, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import enum

class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    PARSING = "parsing"
    PARSED = "parsed"
    REVIEWED = "reviewed"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ReqForgeProject(Base):
    __tablename__ = "reqforge_projects"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    business_domain: Mapped[str | None] = mapped_column(String(100))
    tech_stack: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ReqForgeDocument(Base):
    __tablename__ = "reqforge_documents"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("reqforge_projects.id"), nullable=False)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(50))  # word/pdf/excel/ppt/markdown
    version: Mapped[str] = mapped_column(String(20), default="1.0")
    status: Mapped[DocumentStatus] = mapped_column(SAEnum(DocumentStatus), default=DocumentStatus.PENDING)
    file_path: Mapped[str | None] = mapped_column(Text)
    parsed_content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ReqForgeRequirement(Base):
    __tablename__ = "reqforge_requirements"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("reqforge_projects.id"), nullable=False)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    req_type: Mapped[str] = mapped_column(String(50))  # functional/nonfunctional/business_rule
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    status: Mapped[str] = mapped_column(String(30), default="draft")
    source_doc_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("reqforge_documents.id"), nullable=True)
    source_ref: Mapped[str | None] = mapped_column(String(100))  # "P3 S2" 文档定位
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    confirmed_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class OntologyScope(str, enum.Enum):
    GLOBAL = "global"
    PROJECT = "project"

class ReqForgeOntologyType(Base):
    __tablename__ = "reqforge_ontology_types"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50))  # entity/relation/event/fact
    scope: Mapped[OntologyScope] = mapped_column(SAEnum(OntologyScope), default=OntologyScope.GLOBAL)
    project_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("reqforge_projects.id"), nullable=True)
    properties: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ReqForgeArtifact(Base):
    __tablename__ = "reqforge_artifacts"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("reqforge_projects.id"), nullable=False)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    artifact_type: Mapped[str] = mapped_column(String(50))  # prd/flowchart/prototype/datadict/api/test/trace/task
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    version: Mapped[str] = mapped_column(String(20), default="1.0.0")
    status: Mapped[str] = mapped_column(String(30), default="draft")
    content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
