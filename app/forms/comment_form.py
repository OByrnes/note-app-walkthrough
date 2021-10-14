from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length


class CommentForm(FlaskForm):
    text = StringField("text", validators=[DataRequired("Please Enter a Comment."), Length(-1, 255, "Max Length for comment text is 255 characters")])