from .db import db


shared_notes = db.Table(
    "shared_notes",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("note_id", db.Integer, db.ForeignKey("notes.id"), primary_key=True)
)
