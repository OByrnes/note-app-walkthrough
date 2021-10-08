from flask import Blueprint, request
from flask_login import login_required, current_user
from app.forms import NoteForm
from app.models import Note, db

notes_routes = Blueprint('notes', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages



@notes_routes.route('/', methods=["POST"])
@login_required
def add_new_note():
    user_id = current_user.id
    form = NoteForm()
    print(form.data)
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


@notes_routes.route('/<int:note_id>', methods=["GET"])
@login_required
def get_one_note(note_id):
    note = Note.query.get(note_id)
    if note:
        return note.to_dict()
    return {"errors": ["Note does not exist"]}


@notes_routes.route('/', methods=["GET"])
@login_required
def get_note():
    user_id = current_user.id
    userNotes = Note.query.filter(Note.user_id == user_id)
    print(userNotes)
    return {note.just_id(): note.to_dict() for note in userNotes}

@notes_routes.route('/<int:note_id>', methods=["DELETE"])
@login_required
def delete_note(note_id):
    deletedNote = Note.query.get(note_id)
    db.session.delete(deletedNote)
    db.session.commit()
    return {"delete": note_id}