from .db import db
import datetime


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(3000), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now())

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "text": self.text,
            "date": self.date
        }

    def just_id(self):
        return self.id
