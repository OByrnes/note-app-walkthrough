"""empty message

Revision ID: 024ff861b0be
Revises: f4dc8c49874e
Create Date: 2021-10-12 17:04:37.778147

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import sessionmaker

Session = sessionmaker()

# revision identifiers, used by Alembic.
revision = '024ff861b0be'
down_revision = 'f4dc8c49874e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    item_types = postgresql.ENUM('note', 'comment', name='item_types')
    item_types.create(op.get_bind(), checkfirst=True)
    op.add_column('comments', sa.Column('item_id', sa.Integer(), nullable=False))
    op.add_column('comments', sa.Column('item_type', item_types, nullable=False))
    op.drop_constraint('comments_note_id_fkey', 'comments', type_='foreignkey')
    op.drop_column('comments', 'note_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    item_types = postgresql.ENUM('note', 'comment', name='item_types')
    item_types.drop(op.get_bind(), checkfirst=True)
    op.add_column('comments', sa.Column('note_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('comments_note_id_fkey', 'comments', 'notes', ['note_id'], ['id'])
    op.drop_column('comments', 'item_type')
    op.drop_column('comments', 'item_id')
    # ### end Alembic commands ###
