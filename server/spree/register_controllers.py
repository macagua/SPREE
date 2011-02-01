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
    Provides registration related functionalities
'''
import turbogears
import cherrypy
from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler, exception_handler
import pkg_resources
import logging
import datetime
import sha
import smtplib
import urllib
import string
import random
import shelve,cPickle
from email.MIMEText import MIMEText
from spree.register_widgets import *
from turbogears.database import session
from spree import register_model
from spree.model import User, UserStats
from register_model import RegistrationPendingProfile
from spree.submodels.ontologytree_slim import OntologyTree, Node
from spree.submodels import tree_model

try:
    import turbomail
except ImportError:
    turbomail = None

log = logging.getLogger('registration')

new_user_form = RegTableForm(fields=NewUserFields(), validator=NewUserSchema() )
                                    
edit_user_form = RegTableForm(fields=ExistingUserFields(), validator=ExistingUserSchema())
edit_user_form1 = RegTableForm1(fields=ExistingUserFields1(), validator=ExistingUserSchema1())
edit_user_form2 = RegTableForm2(fields=ExistingUserFields2(), validator=ExistingUserSchema2())

class UserRegistration(controllers.Controller):
    '''
        Allows user to register.
    '''

    #require = identity.not_anonymous();

    def __init__(self):
        '''
            Constructor
        '''
        
        super(UserRegistration, self).__init__()
        random.seed()
        self.hash_salt = ''.join([random.choice(string.printable) for i in range(20)])
        self.smtp_server = config.get('registration.mail.smtp_server', 'localhost')
        self.smtp_port = config.get('registration.mail.smtp_server_port', 25)
        self.smtp_username = config.get('registration.mail.smtp_server.username', None)
        self.smtp_pw = config.get('registration.mail.smtp_server.password', None)
    
    #@expose()
    #def index(self):
    #    if identity.current.anonymous:
    #        redirect('new')
    #    else:
    #        redirect('/')
            
    @expose(content_type="text/html; charset=UTF-8", template='.templates.login_register')
    def register(self, tg_errors=None, msg='', *args, **kw):
        '''
            Returns the login_register template

            @param tg_errors: Optional error messages can be passed here
            @param msg: A status message wchich will be displayed on the client
            @return: Data used for template population
        '''
        
        #if not identity.current.anonymous:
            #redirect('/')
        if tg_errors:
            msg='There was a problem with the data submitted. Please verify your E-Mail address.'
            #turbogears.flash('There was a problem with the data submitted.')
                        #action=./create 
        return dict(form=new_user_form,message=msg)

    @expose(fragment=True, content_type="text/html; charset=UTF-8", template='.templates.register_new')
    def new(self, tg_errors=None, msg='', *args, **kw):
        '''
            Returns the register_new template
            
            @param tg_errors: Optional error messages can be passed here
            @param msg: A status message wchich will be displayed on the client
            @return: Data used for template population
        '''
        
        #if not identity.current.anonymous:
        #redirect('/')
        if tg_errors:
            msg='There was a problem with the data submitted. Please verify your E-Mail address.'
            #turbogears.flash('There was a problem with the data submitted.')
                        #action=./create 
        return dict(form=new_user_form,message=msg)
    

    @expose(format="json")
    def errHand(self, tg_errors=None):
        '''
            Handels errors for form validation.

            @param tg_errors: The errors occured
            @return: The fields where the errors occured and the error messages as lists
        '''
        
        fields = [(param) for param in tg_errors.keys()]
        msgs = [(param) for param in tg_errors.values()]
        return dict(msgs=msgs,fields=fields)


    @validate(form=new_user_form)
    @error_handler(errHand)
    @expose()
    def validateForm(self, user_name, email, email2, password1, password2, *args, **kwargs):
        '''
            Validates the register form.

            @param user_name: Users name
            @param email: Users email address
            @param email2: Users email address for verification
            @param password1: Users password
            @param password2: Users password for verification
        '''
        
        return dict()
    
    def exHandler(self, tg_exceptions=None):
        '''
            Exception handler. Forwards the exceptions to self.new
        '''
        
        redirect("new",tg_errors=tg_exceptions)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", template='.templates.register_create')
    @validate(form=new_user_form)
    @error_handler(new)
    @exception_handler(exHandler)
    def create(self, user_name, email, email2, password1, password2, nocache=None, **kwargs):
        '''
            Creates a temporary user entry (pending user) in a db (that can be promoted to permanent after validation).
            
            @param user_name: Users name
            @param email: Users email address
            @param email2: Users email address for verification
            @param password1: Users password
            @param password2: Users password for verification
            @param nocache: Argument for preventing browser caching
            @return: User name and email address
        '''
        
        if not identity.current.anonymous:
            redirect('/')
        
        key = self.validation_hash(email + user_name + password1)

        pend = register_model.RegistrationPendingUser.new(
                                user_name=user_name,
                                email_address=email,
                                display_name=user_name,
                                password=password1,
                                validation_key=key
                                )

        if config.get('registration.unverified_user.groups'):
            # we have unverified_user.groups.  Add the user to the User table
            # and add the appropriate groups
            user = self.promote_pending_user(pend)
            self.add_unverified_groups(user)
            # log them in
            session.flush()
            i = identity.current_provider.validate_identity(user_name, password1, 
                                                        identity.current.visit_key)
            identity.set_current_identity(i)
        expertise = {}
        for arg in kwargs:
            #get int arguments
            try:
                expertise[int(arg)] = int(kwargs[arg])
            except:
                pass
                
        rpf = RegistrationPendingProfile(pending_user_id=pend.id,expertise=expertise)
        
        session.save(rpf)
        session.flush()
        self.mail_new_validation_email(pend)

        return dict(name=user_name, email=email)
    
    @expose(content_type="text/html; charset=UTF-8", template='.templates.register_validate')
    def validate_new_user(self, email='', *args, **kwargs):
        '''
            Validates pending user in order to promote him to permanent user.

            @param email: The email address to validate
            @return: Information if validation was successfull
        '''
        
        if 'key' in kwargs:
            key = kwargs['key']
        else:
            key = kwargs.get(';key','') 
        
        is_valid = False
        pend = register_model.RegistrationPendingUser.get_by_email_address(email)
        if pend and pend.validation_key == key:
            is_valid = True
        if not is_valid:
            if identity.current.user:  
                #This is probably just someone with an old/stale link
                redirect('/')
            log.info('%s Bad validation using email=%s validation_key=%s' % 
                        (cherrypy.request.remoteAddr, email, key))
            return dict(is_valid=is_valid, 
                        admin_email=config.get('registration.mail.admin_email'))
        else:
            if config.get('registration.unverified_user.groups'):
                # The pending user is already in the Users table
                new_user = register_model.user_class_finder.user_class.by_email_address(email)
                self.remove_all_groups(new_user)
            else:
                # Add the pending user to the Users table
                new_user = self.promote_pending_user(pend)
                # Update expertise
                rpf = RegistrationPendingProfile.get_by(pending_user_id=pend.id)
                expertise = rpf.expertise
                
                new_user.expertise=cPickle.dumps(rpf.expertise)
                ont_tree = tree_model.getTree()
                node_ids=[]
                for e in expertise:
                    node_ids.append(e)
                fullsubtree = ont_tree.getFullSubtree(node_ids)
                expertise_subtree={}
                del ont_tree
                for exp in fullsubtree:
                    if exp in expertise:
                        expertise_subtree[exp]=expertise[exp]
                    else:
                        expertise_subtree[exp]=1
                new_user.expertise_subtree=cPickle.dumps(expertise_subtree)
                    
                new_user.keywords_specified=rpf.keywords
                new_user.websites_specified=rpf.websites
                session.delete(rpf)
                session.flush()
            
            self.add_standard_groups(new_user)
            pend.destroy_self()
            # If you have a protected url that a basic user can log into and see, 
            # set it as login_url (instead of identity.failure_url).  
            # Otherwise, the user will loop back to validate after logging in, and then over 
            # to /.
            login_url = config.get('identity.failure_url')
            return dict(name=getattr(new_user, 'display_name', new_user.user_name), 
                            login=login_url, 
                            is_valid=is_valid)
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8",  html="spree.templates.register_load_docs")
    def getRegisterLoadDocs(self, *args, **kwargs):
        '''
            Returns register_load_docs template which allows specification of web sites and 
            keywords used for profile generization
        '''
        
        return dict()
    
    def promote_pending_user(self, pending_user):
        '''
            Promotes pending user to the official 'users'.

            @param pending_user: The pending user object
            @return: the new user object.
        '''
        
        # Let's try to do this programmatically.  The only thing you should have to modify
        # if you changed the schema fo RegistrationPendingUser is the 'excluded' list.  All 
        # columns not in this list will be mapped straight to a new user object.
        
        # This list contains the columns from RegistrationPendingUser that you DON'T want 
        # to migrate
        excluded = ['created', 'validation_key']
        columns = pending_user.c.keys()   # list of column names
        new_columns = dict()
        for c in columns:
            if c not in excluded:
                new_columns[c] = getattr(pending_user, c)
        UserClass = register_model.user_class_finder.user_class
        new_user = UserClass(**new_columns)
        if new_user:
            new_user.user_stats = UserStats()
        session.flush()
        return new_user

    def mail_new_validation_email(self, pending_user):
        '''
            Generates the new user validation email.

            @param: pending_user The pending user object
        '''
        
        reg_base_url = self.registration_base_url()
        queryargs = urllib.urlencode(dict(email=pending_user.email_address, 
                                          key=pending_user.validation_key))
        #print queryargs
        url = '%s/validate_new_user?%s' % (reg_base_url, queryargs)
        
        body = pkg_resources.resource_string(__name__, 'templates/register_email_body_new.txt')
        

        self.send_email(pending_user.email_address, 
                        config.get('registration.mail.admin_email'), 
                        config.get('registration.mail.new.subject', 'New User Registration'), 
                        body % {'validation_url': url})

     
    @expose(content_type="text/html; charset=UTF-8", template='.templates.login_lost_password')
    def lost_password(self, tg_errors=None, **kwargs):
        '''
            Shows the lost password form.

            @param tg_errors: Not used
            @return: Data for template population
        '''
        
        if identity.current.user:
            redirect('/')
        policy = config.get('registration.lost_password_policy', 'send_current')
        if policy=='reset':
            submit_text='Reset Password'
        if policy=='send_current':
            submit_text='Email Password'
        return dict(policy=policy, form=lost_password_form, action="/registration/recover_lost_password", 
                    submit_text=submit_text)
        

    @expose(fragment=True, content_type="text/html; charset=UTF-8", template=".templates.register_recover_lost_password")
    @validate(form=lost_password_form)
    @error_handler(lost_password)
    def recover_lost_password(self, email_or_username=None):
        '''
            Resets (or mails) a user his forgotten password.

            @param email_or_username: The username or email address entered by the user
            @return: Information if password hass been reset
        '''
        
        #if identity.current.user:
            #redirect('/')
        reset_password = user = user_email = None
        User = register_model.user_class_finder.user_class
        user = User.get_by(email_address=email_or_username)
        if not user:
            user = User.get_by(user_name=email_or_username)
        policy = config.get('registration.lost_password_policy', 'send_current')
        enc_alg = config.get('identity.soprovider.encryption_algorithm', None)

        # We can't send the password if it is encrypted; must reset.
        if user and (enc_alg or (policy == 'reset')):
            # generate a new password for the user
            chars = string.ascii_letters + string.digits
            random.seed()
            new_pw = ''
            # Compose a new random password  6-9 chars long
            for i in range(0, random.choice((6, 7, 8, 9))):
                new_pw = '%s%s' % (new_pw, random.choice(chars))
            user.password = new_pw

            body = pkg_resources.resource_string(__name__, 
                        'templates/register_email_body_reset_password.txt')
            self.send_email(user.email_address, 
                            config.get('registration.mail.admin_email'), 
                            config.get('registration.mail.lost_password.subject', "Password Request"),
                            body % {'password': new_pw, 'user_name': user.user_name})
            user_email = user.email_address
            reset_password = True
        elif user:  # sending the current password
            body = pkg_resources.resource_string(__name__, 
                        'templates/register_email_body_lost_password.txt')
            self.send_email(user.email_address,
                            config.get('registration.mail.admin_email'), 
                            config.get('registration.mail.lost_password.subject', "Password Request"),
                            body % {'password': user.password, 'user_name': user.user_name})
            user_email = user.email_address

        return dict(email=user_email, reset_password=reset_password)
        
    #@expose(fragment=True, content_type="text/html; charset=UTF-8", template='.templates.register_edit_user')
    @identity.require(identity.not_anonymous())
    def edit_user(self, msg='', tg_errors=None):
        '''
            Edits current user information.

            @param msg: A message whcih will be displayed on the client
            @param tg_errors: Not used
            @return: Data for template population
        '''
        
        u = identity.current.user
        #form_values = dict(user_name=u.user_name, email=u.email_address, old_password='',
        #                    password_1='', password_2='')
        form_values1 = dict(user_name=u.user_name, email=u.email_address)
        form_values2 = dict(old_password='', password_1='', password_2='')

        return dict(display_name=u.display_name,
                    form1=edit_user_form1, 
                    form2=edit_user_form2, 
                    form_values1=form_values1, 
                    form_values2=form_values2, 
                    action1="javascript:preferences.submitPersonal(1);",
                    action2="javascript:preferences.submitPersonal(2);",
                    message1=msg,
                    message2=msg)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.preferencesPersonal")
    @identity.require(identity.not_anonymous())
    @validate(form=edit_user_form)
    @error_handler(edit_user)  
    def update_user(self, email, old_password, password1, password2, user_name=None, **kwargs):
        '''
            @deprecated use update_user1/2 instead
            
            Updates the users information with new values.

            @param email: Users new email
            @param old_password: users old password
            @param password1: users new password
            @param password2: users new password
            @param user_name: users name
            @return: Data for template population
        '''
        
        user = identity.current.user
        msg = ""

        if password1:
            user.password=password1
            msg = "Your password was changed. "
        if email and email != user.email_address:
            try:
                self.mail_changed_email_validation(email)
            except:
                 msg = 'The supplied E-Mail address does not exist!'
                 return self.edit_user(msg)
            msg = msg + "A validation email was sent to %s." % email
        turbogears.flash(msg)

        return self.edit_user(msg)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.preferencesPersonal")
    @identity.require(identity.not_anonymous())
    @validate(form=edit_user_form1)
    @error_handler(edit_user)  
    def update_user1(self, email, user_name=None, **kwargs):
        '''
            Updates the users information with new values.

            @param email: Users new email
            @param user_name: Users user name
            @return:Data for template population
        '''

        user = identity.current.user
        msg = ""

        if email and email != user.email_address:
            try:
                self.mail_changed_email_validation(email)
            except:
                 msg = 'The supplied E-Mail address does not exist!'
                 return self.edit_user(msg)
            msg = msg + "A validation email was sent to %s." % email
        else:
            msg = "You supplied your old E-Mail address."
        turbogears.flash(msg)

        return self.edit_user(msg)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.preferencesPersonal")
    @identity.require(identity.not_anonymous())
    @validate(form=edit_user_form2)
    @error_handler(edit_user)  
    def update_user2(self, old_password, password1, password2, **kwargs):
        '''
            Updates the users information with new values.

            @param old_password: The old password that should be changed
            @param password1: The new password
            @param password2: The new password for verification
            @return: Data for template population
        '''
        
        user = identity.current.user
        msg = ""
        if password1:
            user.password=password1
            msg = "Your password was changed. "
        turbogears.flash(msg)

        return self.edit_user(msg)
        
    def mail_changed_email_validation(self, new_email):
        '''
            Sends an email out that has validation information for changed email addresses.
            The logic is that we keep the old (verified) email in the User table, and add the
            new information into the RegistrationUserEmailChange table.  When the user eventually
            validates the new address, we delete the information out of RegistrationUserEmailChange
            and put the new email address into User table.  That way, we always have a "good" email
            address in the User table.
        
            @param new_email: The new email
        '''
        
        unique_str = new_email + identity.current.user.email_address
        validation_key = self.validation_hash(unique_str)
        email_change = register_model.RegistrationUserEmailChange.new(
                                            user=identity.current.user,
                                            new_email_address=new_email,
                                            validation_key=validation_key)
        reg_base_url = self.registration_base_url()
        queryargs = urllib.urlencode(dict(email=new_email, 
                                          key=validation_key))
        url = '%s/validate_email_change?%s' % (reg_base_url, queryargs)
                                            
        body = pkg_resources.resource_string(__name__, 
                                            'templates/register_changed_email.txt')
        self.send_email(new_email,
                    config.get('registration.mail.admin_email'), 
                    config.get('registration.mail.changed_email.subject', 
                                'Please verify your new email address'),
                    body % {'validation_url': url})
    
    @expose(content_type="text/html; charset=UTF-8", template='.templates.register_validate_email')
    def validate_email_change(self, email, key):
        '''
            Validates the email address change and update the database appropriately.

            @param email: The email to be verified
            @param key: The verification key
            @return: Data for template population
        '''
        
        is_valid = False
        admin_email = config.get('registration.mail.admin_email')
        email_change = register_model.RegistrationUserEmailChange.get_by_new_email(email)
        if not email_change:
            return dict(is_valid=False, admin_email=admin_email)
        if email_change.validation_key == key:
            is_valid = True
            user = email_change.user
            # change the user's email address and delete the email_change record
            user.email_address = email
            session.save(user)
            session.flush()
            email_change.destroy_self()
        else:
            return dict(is_valid=False, admin_email=admin_email)
        return dict(is_valid=is_valid, 
                    email=email, 
                    name=user.display_name,
                    admin_email=admin_email)

    def add_standard_groups(self, user):
        '''
            Adds the user to the groups specified in the config file.

            @param user: The user object to be added
        '''
        
        self.add_groups(user, config.get('registration.verified_user.groups', []))
    
    def add_unverified_groups(self, user):
        '''
            Adds the user to the unverified user groups specified in the config file.

            @param user: The user object to be added
        '''
        
        self.add_groups(user, config.get('registration.unverified_user.groups', []))
        
    def add_groups(self, user, group_list):
        '''
            Adds the user to each of the groups in the group_list sequence.

            @param user: The user object to be added
            @param group_list: The group list where the user should be added
        '''
        
        if hasattr(user, 'groups'):
            Group = identity.saprovider.group_class
            for group_name in group_list:
                group = session.query(Group).get_by(group_name=group_name)
                user.groups.append(group)
        else:
            # You may have a bug in your SQLAlchemy identity classes.
            # fortunately, the fix is pretty trivial.
            # http://trac.turbogears.org/turbogears/ticket/1143
            raise AttributeError("Unable to find the 'groups' attribue for this user")
            
    def remove_all_groups(self, user):
        '''
            Removes the user from all groups it belongs to.

            @param user: The user object to be removed
        '''
        user.groups = []
        

    def validation_hash(self, unique_input=""):
        '''
            Serves a hash that can be used for validation.

            @param unique_input: Unique string which is used for hash computation
            @return: Hash value constructed from unique_input
        '''
        
        hash_str =  u" ".join((unique_input, cherrypy.request.remoteAddr, 
                             self.hash_salt, datetime.datetime.now().isoformat()))
        return sha.new(unicode(hash_str).encode('ascii', 'replace')).hexdigest()
        
    def registration_base_url(self):
        '''
            @return: The full http://... address of the registration controller.
            Does not end with a traling slash.

        '''
        
        # Trying to find the path to the main registration controller.
        # If this has trouble, you may need to hardcode the return value
        # for this function
        last_slash = cherrypy.request.path.rfind('/')
        path = cherrypy.request.path[:last_slash]
        return '%s%s' % (cherrypy.request.base, path)
        
    def send_email(self, to_addr, from_addr, subject, body):
        '''
            Sends an email.
            
            @param to_addr: address to which mail is sent
            @param from_adr: address from which mail is sent
            @param subject: subject of the mail
            @param body: text body of the mail
        '''
        
        # Using turbomail if it exists, 'dumb' method otherwise
        if turbomail and config.get('mail.on'):
            msg = turbomail.Message(from_addr, to_addr, subject)
            msg.plain = body
            turbomail.enqueue(msg)
        else:
            msg = MIMEText (body)
            msg['Subject'] = subject
            msg['From'] = from_addr
            msg['To'] = to_addr
        
            smtp = smtplib.SMTP(self.smtp_server, self.smtp_port)
            if self.smtp_username:
                smtp.login(self.smtp_username, self.smtp_pw)
            smtp.sendmail(from_addr, to_addr, msg.as_string())
            smtp.quit()
