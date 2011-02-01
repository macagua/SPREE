'''
	Copyright (C) 2008  Deutsche Telekom Laboratories

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
	Date: 22-01-2008
	
'''
'''
    Provides registration related classes and functions, especially
    a python representation of the database tables used for the 
    registration process 
'''
import turbogears
from spree import model
from sqlalchemy import *
from sqlalchemy.ext.assignmapper import assign_mapper
from sqlalchemy.ext.activemapper import ActiveMapper, column
from turbogears.database import metadata, session
from datetime import datetime
from turbogears import config
import sqlalchemy.databases.mysql as mysql

def create_registration_tables():
    "Create the appropriate database tables."
    registration_pending_user_table.create(checkfirst=True)
    email_change_table.create(checkfirst=True)
    RegistrationPendingProfile.table.create(checkfirst=True)

# Automatically create the registration tables when TurboGears starts up
turbogears.startup.call_on_startup.append(create_registration_tables)

class UserClassFinder(object):
    '''
        Utility class to find and store the main User model.

        There are two properties intended for public use:

        user_class - Returns the main user class (which can be instantiated)
        user_class_name - Returns a string of the name of the user class. This
                          can be useful for SQLObject
    '''
        
    def __init__(self):
        '''
            Constructor
        '''
        
        super(UserClassFinder, self).__init__()
        self.__user_path = None
        self.__class = None
        self.__classname = None
    
    def _find_user_path(self):
        '''
            @return Path to the User class
        '''
        
        if not self.__user_path:
            self.__user_path = config.get('identity.saprovider.model.user',
                                        'spree.model.User')
        return self.__user_path
        
        
    def _user_class(self):
        '''
            @return User class
        '''
        
        if not self.__class:
            path = self._find_user_path()
            self.__class = turbogears.util.load_class(path)
        return self.__class
        
    def _user_class_name(self):
        '''
            @return User class name
        '''
        
        if not self.__classname:
            path = self._find_user_path()
            self.__classname = path.split('.')[-1]
        return self.__classname
            
    user_class = property(_user_class)
    user_class_name = property(_user_class_name)
    
user_class_finder = UserClassFinder()



class RegistrationSQLAlchemyBase(object):
    '''
        Base class to handle generic creation and destruction.
    '''
    
    def __init__(self, **kw):
        '''
            Constructor
        '''
        
        # set each argument as an attribute
        for attr, value in kw.iteritems():
            setattr(self, attr, value)
            
    @classmethod
    def new(cls, **kw):
        '''
            Factory method creates a new instance of this class (both in python and in the db).

        '''
        raise NotImplementedError("Must override new")
        
    def destroy_self(self):
        '''
            Destroys self
        '''
        
        session.delete(self)
        session.flush()
        del(self)

registration_pending_user_table = Table('registration_pending_user', metadata,
                                        Column('id', Integer, primary_key=True),
                                        Column('user_name', String(40), nullable=False, unique=True),
                                        Column('email_address', String(255), nullable=False, unique=True),
                                        Column('display_name', String(255)),
                                        Column('password', String(40)),
                                        Column('created', DateTime, default=datetime.now),
                                        Column('validation_key', String(40))
                                        )

class RegistrationPendingUser(RegistrationSQLAlchemyBase):
    '''
        Holds information about user who is trying to registrate. This is temporary storage
        of a user, until his data is validated and promoted to permanent user.
    '''
    
    def __repr__(self):
        return "RegistrationPendingUser id:%d user_name:%s email_address: %s" % \
                    (self.id, self.user_name, self.email_address)
    
    @classmethod   
    def new(cls, user_name, email_address, display_name, password, validation_key):
        '''
            Writes temporary data about the user in a dbb

            @param cls: The user class
            @param user_name: The users name
            @param email_address: The users email address
            @param display_name: The users display name
            @param password: The users password
            @param validation_key: The validation key
            @return: The new pending user object
        '''
        
        kw = dict ( user_name=user_name, 
                    email_address=email_address,
                    display_name=display_name,
                    password=password,
                    validation_key=validation_key)
        pend = cls(**kw)
        session.save(pend)
        session.flush()
        return pend
        
    @classmethod
    def get_by_email_address(cls, email_address):
        '''
            Returns a user identified by email_address
            
            @param cls: The user class
            @param email_address: Email identifying the user
            @return: User identified by email_address
        '''

        return session.query(cls).get_by(email_address=email_address)

assign_mapper(session.context, RegistrationPendingUser, registration_pending_user_table)

# def newRegistrationPendingUser(user_name,
#                                 email_address,
#                                 display_name,
#                                 password,
#                                 validation_key
#                                 ):
#     pend = RegistrationPendingUser(
#                         user_name = user_name,
#                         email_address = email_address,
#                         display_name = display_name,
#                         password = password,
#                         validation_key = validation_key
#     )
#     session.save(pend)
#     return pend

# def getRegistrationPendingUser(email_address):
#     return session.query(RegistrationPendingUser).get_by(email_address=email_address)
# def deleteRegistrationPendingUser(pend):
#     session.delete(pend)

email_change_table = Table('registration_user_email_change', metadata,
                            Column('id', Integer, primary_key=True),
                            # TODO: should probably make finding the user_id column
                            # more generic
                            Column('user_id', Integer, ForeignKey('tg_user.user_id')),
                            Column('new_email_address', String(255), nullable=False, unique=True),
                            Column('validation_key', String(40), nullable=False),
                            Column('created', DateTime, default=datetime.now)
                        )
    
class RegistrationUserEmailChange(RegistrationSQLAlchemyBase):
    '''
        Holds information about a user who wants to change the email address
    '''
    
    # def __init__(self, user_id, new_email_address, validation_key):
    #     self.user_id = user_id
    #     self.new_email_address = new_email_address
    #     self.validation_key = validation_key
    
    #def __repr__(self):
    #    return "RegistrationUserEmailChange id:%d user_id:%d new_email_address:%s " + \
    #            "validation_key: %s" % (self.id, self.user_id, self.new_email_address, 
    #                                    self.validation_key)
    
    @classmethod
    def new(cls, user, new_email_address, validation_key):
        '''
            Factory method creates a new instance of this class (both in python and in the db).

            @param cls: The user class
            @param user: An identity user object
            @param new_email_address: The new email
            @param validation_key: The generated validation key
        '''
        
        kw = dict(user_id=user.user_id, new_email_address=new_email_address, 
                    validation_key=validation_key)
        email_chg = cls(**kw)
        session.save(email_chg)
        session.flush()
        return email_chg
        
    @classmethod
    def get_by_new_email(cls, new_email_address):
        "Returns an existing object using new_email_address as the lookup item."
        return session.query(cls).get_by(new_email_address=new_email_address)
        
    def _user(self):
        "Returns the User associated with the email change."
        return user_class_finder.user_class.get_by(user_id=self.user_id)
    user = property(_user)
        
assign_mapper(session.context, RegistrationUserEmailChange, email_change_table)


def user_name_is_unique(user_name):
    "Return True if the user_name is not yet in the database."
    UserClass = user_class_finder.user_class
    user_count = session.query(UserClass).count_by(user_name=user_name)
    pending_count = session.query(RegistrationPendingUser).count_by(user_name=user_name)
    if user_count or pending_count:
        return False
    else:
        return True
        
def email_is_unique(email):
    "Return True if the email is not yet in the database."
    UserClass = user_class_finder.user_class
    user_count = session.query(UserClass).count_by(email_address=email)
    pending_count = session.query(RegistrationPendingUser).count_by(email_address=email)
    changed_count = session.query(RegistrationUserEmailChange).count_by(new_email_address=email)
    if user_count or pending_count or changed_count:
        return False
    else:
        return True
    
class RegistrationPendingProfile(ActiveMapper):
    '''
        Table for temporary storing profile while user is in pending state
    '''
    class mapping:
        __table__ = "registration_pending_profile"
        pending_user_id = column(Integer, foreign_key='registration_pending_user.id',primary_key=True)
        expertise = column(PickleType)
        keywords = column(mysql.MSText,default= "")
        websites = column(mysql.MSText,default= "")
        