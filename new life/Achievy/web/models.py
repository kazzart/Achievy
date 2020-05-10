from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from web import app, db
import hashlib



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.String(32), unique=False, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    verified = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(32), nullable=True)
    personalInfo = db.relationship('PersonalInfo', backref='user', uselist=False)

    def __init__(self, login):
        self.login = login

    def save(self, password):
        """
        Функция сохранения нового пользователя в базе данных
        :param password: Пароль
        """
        self.password = hashlib.sha512(
            password.encode("utf-8")).hexdigest()
        db.session.add(self)
        db.session.commit()

    def check_pass(self, password):
        hash = hashlib.sha512(password.encode("utf-8")).hexdigest()
        return self.password == hash

    @staticmethod
    def get(id=None, login=None):
        if login:
            return User.query.filter_by(login=login).first()
        if id:
            return User.query.get(id)
        return User.query.all()


class PersonalInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True, default="")
    is_public = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __str__(self):
        return "Id: " + str(self.user_id) + ", name: " + self.name