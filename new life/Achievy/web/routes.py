from web import app
from flask import redirect, render_template, session, url_for, make_response, request, jsonify

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html')