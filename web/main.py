from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from hashlib import md5
from customExceptions import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.String(32), unique=False, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    verified = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(32), nullable=True)
    personalInfo = db.relationship('PersonalInfo', backref='user', uselist=False)

    @staticmethod
    def register(login: str, password: str, email: str) -> int:
        """
        Adds user into database.

        Parameters
        ----------
        login : str
        password : str
        email : str
        is_public : bool, optional

        Raises
        ------
        UserAlreadyExists
            if user with given login or email already exists in database
        UserException
            if something other went wrong while adding user into database
        """
        user = User(login=login, password=password, email=email)
        db.session.add(user)
        try:
            db.session.commit()
            return 0
        except Exception as exc:
            db.session.rollback()
            problem = exc.args[0]
            if problem.endswith("login"):
                raise UserAlreadyExists("login")
            elif problem.endswith("email"):
                raise UserAlreadyExists("email")
            else:
                with open("error_message.txt", 'w') as file:
                    file.write(str(exc))
                raise UserException(str(exc))

    @staticmethod
    def logIn(login: str, password: str) -> "User":
        """
        Returns user by his login and password
        Parameters
        ----------
        login : str
        password : str

        Returns
        -------
        user : User

        Raises
        ------
        UserNotFound
            if there's no such user in database
        """
        user = User.query.filter_by(login=login, password=password).first()
        if user is None:
            raise UserNotFound()
        else:
            return user

    def getLink(self):
        if self.verified:
            raise UserAlreadyVerified()
        else:
            link = md5(("{}{}{}{}".format(self.id, self.login, self.email, "Just_noise")).encode('utf-8')).hexdigest()
            self.link = link
            db.session.commit()
            return link

    @staticmethod
    def verify(link):
        """
        Verifies user by given link and creates record about his personal info

        Atributes
        ---------
        link : str
            32-length hashcode representing user

        Raises
        ------
        UserNotFound
            if there's no user with given link
        """
        user = User.query.filter_by(link=link).first()
        if user is None:
            raise UserNotFound("Failed to find user with this link")
        else:
            user.link = None
            user.verified = True
            userInfo = PersonalInfo(user=user)
            db.session.add(userInfo)
            db.session.commit()

    def setName(self, name):
        if not self.verified:
            raise UserIsNotVerified
        else:
            self.personalInfo.name = name
            db.session.commit()

    def getInfo(self):
        if not self.verified:
            raise UserIsNotVerified()
        else:
            return self.personalInfo

    def __str__(self):
        return "User id: {0}, login: {1}, password: {2}, email: {3}, is verified: {4} created on: {5}"\
            .format(self.id, self.login, self.password, self.email, self.verified, self.date_created)


class PersonalInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True, default="")
    is_public = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __str__(self):
        return "Id: " + str(self.user_id) + ", name: " + self.name

# db.create_all()
# try:
#     User.register("sdf", "sdf", "sdf")
# except UserAlreadyExists as exc:
#     print(exc.args[0], "already occupied")
# else:
#     print("User added successfully")
#
# tmp = User.logIn("sdf", "sdf")
# # tmp.getLink()
# # print(tmp)
# # User.verify("ec9900fe88c7ea61b1aabc0d7721a469")
# print(tmp.getInfo())
# tmp.setName("kek")
# print(tmp.getInfo())
# print(tmp)