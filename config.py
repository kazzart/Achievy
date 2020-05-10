import os

CSRF_ENABLED = True
SECRET_KEY = '9)6odj22tkx_yxti%!$p*q!_k8eiw0z8bv2q)-y7zhg6*1^027'

basedir = os.path.abspath(os.path.dirname(__name__))
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')

