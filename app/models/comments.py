from sqlalchemy.orm import backref
from sqlalchemy.sql.schema import ForeignKey
from .db import db
from sqlalchemy.dialects.postgresql import ENUM


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    note_id = db.Column(db.Integer, db.ForeignKey("notes.id"))
    parent_id = db.Column(db.Integer, db.ForeignKey("comments.id"))
    text = db.Column(db.String(255), nullable=False)

    user = db.relationship("User", back_populates="comments")
    replies = db.relationship(
        "Comment",
        backref=db.backref('parent', remote_side=[id]),
        lazy='dynamic')
    

    def to_dict(self):
        return {
            "username": self.user.username,
            "id": self.id,
            "text": self.text,
            "comments": [comment.to_dict() for comment in self.replies] if self.replies else None
        }
