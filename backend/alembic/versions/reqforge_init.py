"""create reqforge tables

Revision ID: reqforge_init
Create Date: 2026-05-08
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'reqforge_init'
down_revision = 'add_onboarding_phase'

def upgrade():
    op.create_table('reqforge_projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('business_domain', sa.String(100), nullable=True),
        sa.Column('tech_stack', sa.Text, nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

    op.create_table('reqforge_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reqforge_projects.id'), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('doc_type', sa.String(50)),
        sa.Column('version', sa.String(20), server_default='1.0'),
        sa.Column('status', sa.String(20), server_default='pending'),
        sa.Column('file_path', sa.Text, nullable=True),
        sa.Column('parsed_content', postgresql.JSON, nullable=True),
        sa.Column('uploaded_by', postgresql.UUID(as_uuid=True)),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

    op.create_table('reqforge_requirements',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reqforge_projects.id'), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('req_type', sa.String(50)),
        sa.Column('priority', sa.String(20), server_default='medium'),
        sa.Column('status', sa.String(30), server_default='draft'),
        sa.Column('source_doc_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reqforge_documents.id'), nullable=True),
        sa.Column('source_ref', sa.String(100), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True)),
        sa.Column('confirmed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

    op.create_table('reqforge_ontology_types',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('category', sa.String(50)),
        sa.Column('scope', sa.String(20), server_default='global'),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reqforge_projects.id'), nullable=True),
        sa.Column('properties', postgresql.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

    op.create_table('reqforge_artifacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reqforge_projects.id'), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('artifact_type', sa.String(50)),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('version', sa.String(20), server_default='1.0.0'),
        sa.Column('status', sa.String(30), server_default='draft'),
        sa.Column('content', postgresql.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

def downgrade():
    op.drop_table('reqforge_artifacts')
    op.drop_table('reqforge_ontology_types')
    op.drop_table('reqforge_requirements')
    op.drop_table('reqforge_documents')
    op.drop_table('reqforge_projects')
