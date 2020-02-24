from flask import render_template, redirect, flash, session, request
from web import app#, db
#from .models import User, Vote, Answer
from flask_login import login_required, login_user, logout_user
import hashlib


# class hack():
#     @staticmethod
#     def dbsave(answer):
#         db.session.add(answer)
#         db.session.commit()


def is_auth():
    return 'user_id' in session


def user_id():
    if 'user_id' in session:
        return session['user_id']
    else:
        return 0


# def cur_user():
#     if 'user_id' in session:
#         return User.query.get(session['user_id'])
#     else:
#         return None


@app.route('/')
def main():
    # vote = Vote.query.all()
    # vote.reverse()
    return render_template('base.html', user=True)



