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
    Defines some TG widgets used for registration
'''
from turbogears import widgets, validators, identity
from spree import register_model

class FakeInputWidget(widgets.Widget):
    '''
        Simple widget that allows displaying its value in a span.
    '''
    
    params = ["field_class", "css_classes"]
    params_doc = {'field_class' : 'CSS class for the field',
                  'css_classes' : 'List of extra CSS classes for the field'}
    field_class = None
    css_classes = []
    
    def __init__(self, name=None, label=None, **kw):
        super(FakeInputWidget, self).__init__(name, **kw)
        self.label = label
        self.validator = None
        self.help_text = None
        
    template = """
        <span xmlns:py="http://purl.org/kid/ns#" 
            class="${field_class}" 
            py:content="value" />
        """

class NewUserFields(widgets.WidgetsList):
    '''
        Holds widgets for each new user form field
    '''
    
    user_name = widgets.TextField('user_name',
                    label="User Name",
                    help_text="A short name that you will use to log in.")
                    
    email = widgets.TextField('email',
                    label="Email",
                    help_text="Your email address (this will be validated).")
                    
    email_2 = widgets.TextField('email2',
                    label="Email (again)",
                    help_text="Your email address again, please.")
    
    #display_name = widgets.TextField('display_name',
    #                label="Display Name",
    #                help_text="A user name that others will see.")
                    
    password_1 = widgets.PasswordField('password1',
                    label="Password",
                    help_text="Your password.")
                    
    password_2 = widgets.PasswordField('password2',
                    label= "Password (again)",
                    help_text="Same password as above (the two should match).")

class ExistingUserFields1(widgets.WidgetsList):
    '''
        Holds widgets for each change email form field
    '''
    
    user_name = FakeInputWidget('user_name',
                    label="User Name" )
                    
    email = widgets.TextField('email',
                    label="Email",
                    help_text="Your email address (this will be validated).")

class ExistingUserFields2(widgets.WidgetsList):
    '''
        Holds widgets for each change password form field
    '''
    
    old_password = widgets.PasswordField('old_password',
                   label="Current password",
                   help_text="The current (old) password.")

    password_1 = widgets.PasswordField('password1',
                    label="New Password",
                    help_text="Your new password.")

    password_2 = widgets.PasswordField('password2',
                    label="New Password (again)",
                    help_text="New password again.")
                    
class ExistingUserFields(widgets.WidgetsList):
    '''
        @deprecated Use ExistingUserFields1/2 instead
        
        Holds widgets for each edit user form field
    '''
    
    user_name = FakeInputWidget('user_name',
                    label="User Name" )
                    
    email = widgets.TextField('email',
                    label="Email",
                    help_text="Your email address (this will be validated).")
    
    # display_name = widgets.TextField('display_name',
    #                 label="Display Name",
    #                 help_text="A longer user name that others will see.")
    
    old_password = widgets.PasswordField('old_password',
                   label="Current password",
                   help_text="The current (old) password.")

    password_1 = widgets.PasswordField('password1',
                    label="New Password",
                    help_text="Your new password.")

    password_2 = widgets.PasswordField('password2',
                    label="New Password (again)",
                    help_text="New password again.")

                    
class UniqueUsername(validators.FancyValidator):
    '''
        Validator to confirm that a given user_name is unique.
    '''
    
    messages = {'notUnique': 'That user name is already being used.'}
    
    def _to_python(self, value, state):
        if not register_model.user_name_is_unique(value):
            raise validators.Invalid(self.message('notUnique', state), value, state)
        return value

class UniqueEmail(validators.FancyValidator):
    '''
        Validator to confirm a given email address is unique.
    '''
    
    messages = {'notUnique': 'That email address is registered with an existing user.'}
    
    def _to_python(self, value, state):
        if identity.not_anonymous():
            if value == identity.current.user.email_address:
                # the user isn't trying to change their email address
                # so the value is ok
                return value 
        if not register_model.email_is_unique(value):
            raise validators.Invalid(self.message('notUnique', state), value, state)
        return value
        
class ValidPassword(validators.FancyValidator):
    '''
        Validator to test for validity of password.
    '''

    messages = {'invalid': 'The password you supplied is invalid.'}

    def validate_python(self, value, state):
        user = identity.current.user
        if not identity.current_provider.validate_password(user, user.user_name, value):
            raise validators.Invalid(
                self.message('invalid', state), value, state)
        return value
        
class NewUserSchema(validators.Schema):
    '''
        Holds validators for each new user form field
    '''
    
    user_name = validators.All(validators.UnicodeString(not_empty=True, 
                                                        max=16, strip=True),
                                UniqueUsername())
    email = validators.All(validators.Email(not_empty=True, max=255),
                                UniqueEmail())
    email2 = validators.All(validators.Email(not_empty=True, max=255))
    #display_name = validators.UnicodeString(not_empty=True, strip=True, max=255)
    password1 = validators.UnicodeString(not_empty=True, max=40)
    password2 = validators.UnicodeString(not_empty=True, max=40)
    chained_validators = [validators.FieldsMatch('password1', 'password2'),
                            validators.FieldsMatch('email', 'email2')]
    
class ExistingUserSchema(validators.Schema):
    '''
        @deprecated Use ExistingUserSchema1/2 instead
    '''
    
    email = validators.All(validators.Email(not_empty=True, max=255),
                                UniqueEmail())
    old_password = validators.All(validators.UnicodeString(max=40),
                                    ValidPassword())
    password1 = validators.UnicodeString(max=40)
    password2 = validators.UnicodeString(max=40)
    chained_validators = [validators.FieldsMatch('password1', 'password2')]

class ExistingUserSchema1(validators.Schema):
    '''
        Holds widgets for each change email form field
    '''
    
    email = validators.All(validators.Email(not_empty=True, max=255),
                                UniqueEmail())

class ExistingUserSchema2(validators.Schema):
    '''
        Holds widgets for each change password form field
    '''
    
    old_password = validators.All(validators.UnicodeString(not_empty=True,max=40),
                                    ValidPassword())
    password1 = validators.UnicodeString(not_empty=True,max=40)
    password2 = validators.UnicodeString(max=40)
    chained_validators = [validators.FieldsMatch('password1', 'password2')]
    
class RegTableForm(widgets.TableForm):
    '''
        Widget for the registration form
    '''
    
    template = 'spree.templates.register_tabletemplate'
    
class RegTableForm1(widgets.TableForm):
    '''
        Widget for the registration form used for edit user(email change)
    '''
    
    template = 'spree.templates.register_tabletemplate1'

class RegTableForm2(widgets.TableForm):
    '''
        Widget for the registration form used for edit user(password change)
    '''
    
    template = 'spree.templates.register_tabletemplate2'
    
lost_password_form = RegTableForm( fields = [
                                            widgets.TextField('email_or_username',
                                            label='User Name or Email Address',
                                            validator=validators.UnicodeString(not_empty=True, max=255)) ]
                                        )
            