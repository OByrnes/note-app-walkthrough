from flask import Blueprint, request
from flask_login import login_required, current_user
from app.forms import CommentForm
from app.models import Note, db, Comment

comment_routes = Blueprint('comments', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@comment_routes.route("/", methods=["POST"])
@login_required
def add_new_comment():
    user_id = current_user.id
    note_id = request.json['note_id']
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if request.json['parent_id'] != "N/A":
            new_comment = Comment(
                user_id=user_id,
                parent_id=request.json['parent_id'],
                text=form.data["text"]
            )
            db.session.add(new_comment)
            db.session.commit()
            
            note = Note.query.get(note_id).to_dict()
            return note
        else:
            new_comment = Comment(
                user_id=user_id,
                note_id=request.json['note_id'],
                text=form.data["text"]
            )
            db.session.add(new_comment)
            db.session.commit()
            note = Note.query.get(note_id).to_dict()
            return note
    
    return {'errors': validation_errors_to_error_messages(form.errors)}


@comment_routes.route("/<int:comment_id>", methods=["PATCH"])
@login_required
def edit_comment(comment_id):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment = Comment.query.get(comment_id)
        comment.text = form.data['text']
        db.session.commit()
        note = Note.query.get(request.json['note_id']).to_dict()
        return note
    return {'errors': validation_errors_to_error_messages(form.errors)}


@comment_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    note_id = request.json['note_id']
    if comment:
        db.session.delete(comment)
        db.session.commit()
    note = Note.query.get(note_id)
    note = note.to_dict()
    
    return note

