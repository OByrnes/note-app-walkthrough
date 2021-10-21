from flask import Blueprint, request
from app.models import Note, db
from app.forms import NoteForm
from flask_login import login_required, current_user
from app.helpers import validation_errors_to_error_messages

notes_routes = Blueprint('notes', __name__)


@notes_routes.route("/", methods=["GET"])
@login_required
def get_notes():
    user_id = current_user.id
    user_notes = Note.query.filter(Note.user_id == user_id)
    return {note.just_id(): note.to_dict() for note in user_notes}



@notes_routes.route("/<int:note_id>", methods=["GET"])
@login_required
def get_one_note(note_id):
    note = Note.query.get(note_id)
    if note:
        return note.to_dict()
    return {"errors": ["Note does not exist"]}


@notes_routes.route('/', methods=["POST"])
@login_required
def add_new_note():
    user_id = current_user.id
    form = NoteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_note = Note(
             text=form.data['text'],
             title=form.data['title'],
             user_id=user_id,
             date=form.data['date']
        )
        db.session.add(new_note)
        db.session.commit()
        return new_note.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}


@notes_routes.route('/<int:note_id>', methods=["PATCH"])
@login_required
def edit_note(note_id):
    form = NoteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        updatedNote = Note.query.get(note_id)
        updatedNote.text = form.data['text']
        updatedNote.title = form.data['title']
        updatedNote.date = form.data['date']

        db.session.commit()
        return updatedNote.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}

@notes_routes.route('/<int:note_id>', methods=["DELETE"])
@login_required
def delete_note(note_id):
    deletedNote = Note.query.get(note_id)
    db.session.delete(deletedNote)
    db.session.commit()
    return {"delete": note_id}