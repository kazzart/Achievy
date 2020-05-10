from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
# db = SQLAlchemy(app)
#from .models import User
# @login_manager.user_loader
# def load_user(user_id):
#     return User.query.filter_by(id=user_id).first()

import web.views
