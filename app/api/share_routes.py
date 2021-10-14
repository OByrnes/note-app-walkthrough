from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Note, db, User

share_routes = Blueprint("share", __name__)


@share_routes.route("/<int:note_id>", methods=["POST"])
@login_required
def share_note(note_id):
    username = request.json["username"]
    note = Note.query.get(note_id)
    user = User.query.filter(User.username == username).first()
    if(user and note):
        note.shared_users.append(user)
        db.session.commit()
        return note.to_dict()
    if(not note):
        return {"errors": ["Note was not found"]}
    if(not user):
        return {"errors": ["User was not found"]}


@share_routes.route("/<int:note_id>", methods=["DELETE"])
@login_required
def unshare_note(note_id):
    note = Note.query.get(note_id)
    username = request.json["username"]
    user = User.query.filter(User.username == username).first()
    if(user and note):
        note.shared_users.remove(user)
        db.session.commit()
        return note.to_dict()
    if(not note):
        return {"errors": ["Note was not found"]}
    if(not user):
        return {"errors": ["User was not found"]}