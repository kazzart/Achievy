from flask import render_template, redirect, flash, session, request, url_for
from web import app#, db
from .forms import *
from .models import User
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
    return render_template('main.html', user=True)

def cur_user():
    if 'Login' in session:
        return True #User.get(login=session['Login'])
    return False #None

@app.route('/reg')
def reg():
    '''TO DO: add validation on user login'''
    form = RegForm()

    if form.validate_on_submit():
        user = User(form.login_reg.data)
        # user.save(form.password_reg.data)
        session["Login"] = form.login_reg.data #user.login
        return redirect(url_for("main"))

    return render_template('reg.html', form=form, user=cur_user())



