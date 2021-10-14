from .db import db
import datetime
from .sharing import shared_notes


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(3000), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now())

    user = db.relationship("User", back_populates="notes")
    shared_users = db.relationship("User", secondary=shared_notes, back_populates="shared_notes", cascade="all, delete")
    comments = db.relationship("Comment")


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "text": self.text,
            "date": self.date,
            "shared_by": self.user.username,
            "shared": [sharedUser.username for sharedUser in self.shared_users],
            "comments": {comment.id: comment.to_dict() for comment in self.comments}
        }
    
    def just_id(self):
        return self.id
