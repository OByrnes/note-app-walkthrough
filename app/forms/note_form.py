from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length
from wtforms.fields.html5 import DateTimeLocalField


class NoteForm(FlaskForm):
    text = StringField("text", validators=[DataRequired(), Length(-1, 3000, "Max Length for note text is 3000 characters")])
    title = StringField("title", validators=[DataRequired(), Length(-1, 255, "Max Length for Title is 255 characters")])
    date = DateTimeLocalField("date", validators=[DataRequired()],  format='%Y-%m-%dT%H:%M')
