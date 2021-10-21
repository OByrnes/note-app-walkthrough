"""empty message

Revision ID: 6b91d558c9e0
Revises: a6be069c03ee
Create Date: 2021-10-08 13:14:07.498330

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b91d558c9e0'
down_revision = 'a6be069c03ee'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('shared_notes',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('note_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'note_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('shared_notes')
    # ### end Alembic commands ###