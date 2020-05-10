from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField, FieldList, BooleanField, RadioField, FileField, HiddenField
from wtforms.validators import Length, EqualTo, ValidationError, DataRequired, Optional
from web.models import User
from .helper import cur_user
import re
from flask.json import JSONDecoder
from flask_wtf import FlaskForm
from wtforms.widgets import CheckboxInput, ListWidget


def not_exist(form, field):
    if User.get(login=field.data):
        raise ValidationError("Такой пользователь уже существует")


def exist(form, field):
    if User.get(login=field.data) is None:
        raise ValidationError("Такого пользователя не существует")


def check_correct_name(form, field):
    if not re.match(r'[a-zA-Z0-9_]', field.data):
        raise ValidationError("В имени пользователя могут быть только цифры, латинские буквы и нижние подчёркивания")


def match(form, field):
    user = None
    if cur_user():
        user = cur_user()
    elif form.login_log.data is not '':
        user = User.get(login=form.login_log.data)
    if user and not user.check_pass(field.data):
        raise ValidationError("Неправильный пароль")


class RegForm(FlaskForm):
    login_reg = StringField("Имя пользователя", validators=[Length(5, message='Логин слишком короткий'),
                                                            not_exist, check_correct_name])
    password_reg = PasswordField("Пароль", validators=[Length(8, message='Пароль слишком короткий')])
    confirm_reg = PasswordField("Повторите пароль",
                                validators=[Length(8, message='Пароль слишком короткий'),
                                            EqualTo("password_reg", message="Пароли должны совпадать")])
    submit_reg = SubmitField("Зарегистрироваться")
    submit_main = SubmitField("На главную")


class LogForm(FlaskForm):
    """Форма авторизации"""
    login_log = StringField("Имя пользователя", validators=[Length(5, message='Логин слишком короткий'),
                                                            check_correct_name, exist])
    password_log = PasswordField("Пароль", validators=[Length(8, message='Пароль слишком короткий'),
                                                       match])
    submit_log = SubmitField("Войти")
    submit_main = SubmitField("На главную")

