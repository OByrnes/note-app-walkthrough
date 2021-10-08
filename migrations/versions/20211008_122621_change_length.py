"""change-length

Revision ID: a6be069c03ee
Revises: 8fc9199b04a3
Create Date: 2021-10-08 12:26:21.652265

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a6be069c03ee'
down_revision = '8fc9199b04a3'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('notes', 'title',
               existing_type=sa.VARCHAR(length=3000),
               type_=sa.String(length=255),
               existing_nullable=False)
    op.alter_column('notes', 'text',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=3000),
               existing_nullable=False)


def downgrade():
    op.alter_column('notes', 'text',
               existing_type=sa.VARCHAR(length=3000),
               type_=sa.String(length=255),
               existing_nullable=False)
    op.alter_column('notes', 'title',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=3000),
               existing_nullable=False)
