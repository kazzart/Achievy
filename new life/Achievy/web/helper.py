from web import app
from flask import session
from web.models import User

def cur_user():
    if 'Login' in session:
        return User.get(login=session['Login'])
    return None