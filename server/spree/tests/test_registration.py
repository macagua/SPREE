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
from turbogears import config, database, controllers, testutil, startup
from spree import register_controllers, model, register_model
import cherrypy
import urllib
import unittest

# please update these lines appropriately
# config.update({'global':{'registration.mail.smtp_server':'smtp.example.com'}})
# test_email = 'plewis@example.net'
# new_email = 'pat.lewis@example.com'

config.update({'global': {
                    'visit.on':True,
                    'visit.identity': 'sqlalchemy',
                    'identity.on':True }
                })

RegistrationPendingUser = register_model.RegistrationPendingUser
RegistrationUserEmailChange = register_model.RegistrationUserEmailChange

class SharedMethods(object):
    "Container for methods that can be shared in SQLAlchemy and SQLObject test cases."
    
    def create_pending_user_by_request(self):
        req_str = ''.join(['/register/create?user_name=%s&email=%s&email2=%s',
                            '&display_name=%s&password1=%s&password2=%s']) % \
                            ('dschrute', test_email, test_email, 'Dwight+Schrute',
                            'secret', 'secret')
        testutil.createRequest(req_str)
        
    def assert_ok_response(self):
        if cherrypy.response.status != '200 OK':
            raise AssertionError, cherrypy.response.body[0]


# database.set_db_uri('sqlite:///:memory:', 'sqlalchemy')
# session = database.session
# config.update({'global': {
#                     'identity.provider': 'sqlalchemy',
#                     'visit.saprovider.model':'spree.model.Visit',
#                     'identity.saprovider.model.user':"spree.model.User",
#                     'identity.saprovider.model.group':"spree.model.Group",
#                     'identity.saprovider.model.permission':"spree.model.Permission",
#                     'identity.saprovider.model.visit':"spree.model.VisitIdentity",
#                     'sqlalchemy.echo': False,
#                     }})
# class TestRegistrationModel(unittest.TestCase, SharedMethods):
#     def setUp(self):
#         database.create_session()
#         self.create_identity_tables()
#         register_model.create_registration_tables()
#         cherrypy.server.stop()
#         cherrypy.root = None
#         cherrypy.tree.mount_points = {}
#         cherrypy.tree.mount(RegTestController(), '/')
#         config.update({'global':{'registration.verified_user.groups':[],
#                                 'registration.unverified_user.groups':[] }
#                         })
#     def tearDown(self):
#         database.rollback_all()
#         self.drop_identity_tables()
#         self.drop_registration_tables()
#         #testutil.sqlalchemy_cleanup()
#         startup.stopTurboGears()
#     def test_new_registration(self):
#         "A new pending user is created."
#         self.create_pending_user_by_request()
#         self.assert_ok_response()
#         pend = RegistrationPendingUser.get_by_email_address(test_email)
#         assert(pend.user_name=='dschrute')
#         assert(register_model.user_class_finder.user_class.select().count('*')==0)
#     def test_user_validation(self):
#         "A pending user is promoted to an actual user on validation."
#         self.create_pending_user()
#         assert(session.query(RegistrationPendingUser).count()==1)
#         req_str = '/register/validate_new_user?email=%s&key=%s' % (test_email, '0123456789')
#         testutil.createRequest(req_str)
#         self.assert_ok_response()
#         assert(session.query(RegistrationPendingUser).count()==0)
#         User = register_model.user_class_finder.user_class
#         usr = session.query(User).get_by(email_address=test_email)
#         assert(usr.user_name=='dschrute')
#     def test_in_groups_on_validation(self):
#         "A new (validated) user is placed in the appropriate groups."
#         # create the Group 
#         model.Group(group_name='dojo_members', display_name='Members of the dojo')
#         config.update({'global':{'registration.verified_user.groups':['dojo_members']}})
#         self.create_pending_user()
#         req_str = '/register/validate_new_user?email=%s&key=%s' % (test_email, '0123456789')
#         testutil.createRequest(req_str)
#         self.assert_ok_response()
#         User = register_model.user_class_finder.user_class 
#         usr = session.query(User).get_by(email_address=test_email)
#         assert(len(usr.groups)==1)
#         assert(usr.groups[0].group_name=='dojo_members')
#     def test_pending_user_groups(self):
#         "A unvalidated user is made a real user in the unvalidated group(s)."
#         # create the group
#         g_visit = model.Group(group_name='dojo_visitors', display_name='Visitors to the dojo')
#         g_member = model.Group(group_name='dojo_members', display_name='Members of the dojo')
#         config.update({'global':{'registration.unverified_user.groups':['dojo_visitors'],
#                                     'registration.verified_user.groups':['dojo_members']}})
#         session.flush([g_visit, g_member])
#         assert session.query(model.Group).count()==2
#         print "Before create user"
#         self.create_pending_user_by_request()
#         print "After create user"
#         assert getattr(cherrypy.request, 'identity', None)
#         self.assert_ok_response()
#         # assert 0
#         pend = RegistrationPendingUser.get_by_email_address(test_email)
#         # A new user should now be created, and should have the unverified groups
#         User = register_model.user_class_finder.user_class 
#         usr = session.query(User).get_by(email_address=test_email)
#         assert(len(usr.groups)==1)
#         assert(usr.groups[0].group_name=='dojo_visitors')
#         # ok, now lets validate this user.
#         req_str = '/register/validate_new_user?email=%s&key=%s' % (test_email, pend.validation_key)
#         pend = None
#         testutil.createRequest(req_str)
#         session.refresh(usr)
#         assert(session.query(RegistrationPendingUser).count()==0)
#         assert(len(usr.groups)==1)
#         assert(usr.groups[0].group_name=='dojo_members')
#     def create_pending_user(self):
#         pend = RegistrationPendingUser.new(user_name='dschrute',
#                                         email_address=test_email,
#                                         display_name='Dwight Schrute',
#                                         password='secret',
#                                         validation_key='0123456789')
#         session.save(pend)
#         session.flush()
#         return pend
#     def create_identity_tables(self):
#         model.users_table.create()
#         model.permissions_table.create()
#         model.groups_table.create()
#         model.user_group_table.create()
#         model.group_permission_table.create()
#         model.visits_table.create()
#         model.visit_identity_table.create()
#     def drop_identity_tables(self):
#         model.users_table.drop()
#         model.permissions_table.drop()
#         model.groups_table.drop()
#         model.user_group_table.drop()
#         model.group_permission_table.drop()
#         model.visits_table.drop()
#         model.visit_identity_table.drop()
#     def drop_registration_tables(self):
#         register_model.registration_pending_user_table.drop()
#         register_model.email_change_table.drop()
        

class RegTestController(controllers.RootController):
    
    register = register_controllers.UserRegistration()