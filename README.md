# Building an API
## Steps

For this walkthough I'll be using the user stories on [this project board](https://github.com/OByrnes/note-app-walkthrough/projects/1)

Very Basic note taking app. I'll be building out the Note feature 

---
### ALL OF THE IMPORTS 

Start by making a file in /app/api folder that has the routes (note_routes.py) for this feature

> Remember that we will be using restful api patterns


`from flask import Blueprint, request`

`from app.models import Note`


Make the Blueprint for that route

`notes_routes = Blueprint('notes', __name__)`

We will be building all of the routes for notes in this file.


---
#### __init__.py

in the `__init__.py`
import the file
`from .api.note_routes import note_routes`
register the blueprint
`app.register_blueprint(note_routes, url_prefix="/api/notes")`



---
### WTForms

in /app/forms create a file called note_form.py

```
from flask_wtf import FlaskForm
from wtforms.fields.html5 import DateTimeLocalField
from wtforms import StringField 
(whatever fields you will use import them here)
from wtforms.validators import DataRequired, Length
(whatever built in validators import them here)
```

> Build your form with your model in mind. I open both side by side to see what validators and fields I need

If the model looks like:

```
from .db import db
import datetime


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.String(3000), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now())

        
```

We need 2 string fields and a datetime field, you could also have user_id as a field if you want but for this walkthrough we'll just be doing current_user from flask login

So our form will look like

```
class NoteForm(FlaskForm):
    text = StringField("text")
    title = StringField("title")
    date = DateTimeLocalField("date")
```
Now for Validators, looking at the model I know I want to make sure that the title is less than 255 characters and is not null, the text is less than 3000 characters and is not null. 

For length we'll use the built in Length method which takes in a minimum length, a maximum length and a message to be displayed
```
class NoteForm(FlaskForm):
    text = StringField("text", validators=[DataRequired(), Length(-1, 3000, "Max Length for note text is 3000 characters")])
    title = StringField("title", validators=[DataRequired(), Length(-1, 255, "Max Length for Title is 255 characters")])
    date = DateTimeLocalField("date", validators=[DataRequired()],  format='%Y-%m-%dT%H:%M')
```
For the DateTimeLocalField I specify the format the date will be in so that I don't have to convert it. format='%Y-%m-%dT%H:%M' ( ex 2021-01-15T12:15)


**Important** 
When you have written the form don't forget to import it into forms/__init__.py

```
from .note_form import NoteForm
```


Then import it at the top of note_routes.py (or what you are calling it)

```
from app.forms import NoteForm
```
You can use this function to make a dictionary of error messages

```
def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages
```

Ideally you can just put it in a helper function folder and import it into each of your api/ files (or copy and paste :(  )

---
### GET

For this user story:

*As a logged in users I want to navigate to the notes page so that I can see all the notes*
 - [ ] I want to be able to see all my notes
 
 
 We will need to write a GET route for ALL the notes associated with the current user
 
current_user and login_required are from flask_login
I strongly suggest using them in conjunction because if the user is not logged in the current_user is an annonymous user mixin and trying to get the id or calling a method on it will throw an error

``` 
@notes_routes.route('/', methods=["GET"])
@login_required
def get_notes():
    user_id = current_user.id
    <!--  Query for MANY notes by a value in the Note table matching a specified value    -->
    userNotes = Note.query.filter(Note.user_id == user_id)
<!--  RETURN your data in the format you want to work with it in! If you want key value pairs turn it into a dictionary    -->
    return {note.just_id(): note.to_dict() for note in userNotes}
```
> Flask is very exact with its trailing slashes so if your route is defined here as '/'
> the fetch should look like:
> const response = await fetch(`/api/notes/`)
> This will cause a miriad of very annoying errors if you are missing the trailing slash

---
 For this user story:
 
 *As a user I want to navigate to the individual note page so that I can see the entire note text*
 
 I will need a get route for just One note
 
 this fetch will look like fetch(`/api/notes/${id}`)
 ```
@notes_routes.route('/<int:note_id>', methods=["GET"])
@login_required
def get_one_note(note_id):
<!--  Query for ONE note by ID    -->
    note = Note.query.get(note_id)
    if note:
        return note.to_dict()
<!--     See how errors is always returned as an array? Normalizing the data makes it easier to work with.     -->
    return {"errors": ["Note does not exist"]}
```

---
### POST

For this User story I need a POST route

*As a user I want to click the plus button and navigate to the new note form so I can create a new note*

Route `/api/notes/`

If you are using 
```
headers: {
        'Content-Type': 'application/json'
      },
```
as the header in your fetch the request data is imported into the form automatically. Just make sure that the keys in the body of the request match up with your form.

```body: JSON.stringify({
       text: note.text,
       title: note.title,
       date: note.date
      })
```
The variable names need to match up with the fields in the form. So `text`, `date`, `title` match what I am calling the fields in the NoteForm.


```
@notes_routes.route('/', methods=["POST"])
@login_required
def add_new_note():
    user_id = current_user.id
    form = NoteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
<!--   Appends the csrf_token to the form   -->
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
```

Note:
If you are not using 'application/json' as the Content-Type in the request, You need to pass in the data to the form as a parameter. If you are using [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to pass images, files or audio files from the front end, you leave the content type off the fetch request. So instead of getting the data from the request you must pass the request.form.

```
form = NoteForm(request.form)

```
Again the keys in the formData need to match the variables in the form


---
### Update

For this user story I need an update route

*As a logged in user I want to Edit the text, title or date and click the save button so that I can edit and save the note*
 
Route `/api/notes/${note.id}`


```
@notes_routes.route('/<int:note_id>', methods=["PATCH"])
@login_required
def edit_note(note_id):
    form = NoteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        updatedNote = Note.query.get(note_id)
        
<!--  query for the note with the note id     -->

        updatedNote.text = form.data['text']
        updatedNote.title = form.data['title']
        updatedNote.date = form.data['date']
<!--    Update the fields     -->

        db.session.commit()
<!--      You don't need to add it to the session this time. Just commit    -->
        return updatedNote.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}
```

*Very IMPORTANT!!!!*

In these examples I am returning the errors without setting the status of the response so even though there are errors the status of the response is still OK. If you want the response to not be ok you need to set the code when you are returning the errors. 

```
return {"errors": validation_errors_to_error_messages(form.errors)}, 401
```
---

### Delete

For this User story I need a delete route `/api/notes/${id}`

*As a user I want to click delete button at the bottom of the notes page so that I can delete the note*
 

```
@notes_routes.route('/<int:note_id>', methods=["DELETE"])
@login_required
def delete_note(note_id):
    deletedNote = Note.query.get(note_id)
<!--  Query for the note to be deleted by id    -->
    db.session.delete(deletedNote)
    db.session.commit()
    return {"delete": note_id}
```


**Key Takeaways:**

One: Return the data in the same format that you want to work with in the frontend

Two: WTForms can do A LOT of the heavy lifting for you when it comes to error handling

Three: Use the documentation to make your life easier! 

[Flask login](https://flask-login.readthedocs.io/en/latest/)

[Flask Blueprint](https://flask.palletsprojects.com/en/2.0.x/tutorial/views/)

[wtforms validators](https://wtforms.readthedocs.io/en/2.3.x/validators/)

[wtforms fields](https://wtforms.readthedocs.io/en/2.3.x/fields/)
