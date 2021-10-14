from .db import db
from .sharing import shared_notes
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    notes = db.relationship("Note", back_populates="user", cascade="all, delete-orphan")
    shared_notes = db.relationship("Note", secondary=shared_notes, back_populates="shared_users")
    comments = db.relationship("Comment", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            "shared_notes": {note.id: note.to_dict() for note in self.shared_notes}
        }
    
    def safe_dict(self):
        return {
            "username": self.username
        }
