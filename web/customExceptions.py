class dbException(Exception):
    """Base exception class for working with databases"""
    pass


class UserException(dbException):
    """Base exception class for working with user"""
    pass


class UserNotFound(UserException):
    """Raised when there is no such user in database."""
    pass


class UserAlreadyExists(UserException):
    """
    Raised when user with given information already exists in database

    Attributes
    ----------
    collision : str
        coinciding field
    """
    def __init__(self, collision):
        self.collision = collision


class UserAlreadyVerified(UserException):
    """
    Raised when trying to create a verification link for a user that already has been verified
    """


class UserIsNotVerified(UserException):
    """
    Raised when trying to perform an action that is restricted to not verified user
    """