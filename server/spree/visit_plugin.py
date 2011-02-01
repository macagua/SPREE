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
    Provides "remember me" functionality
'''
import turbogears
import cherrypy
import time
import sha

from turbogears import identity
from turbogears.config import get
from turbogears.identity.visitor import log

from spree.model import User


BaseIdentityVisitPlugin = identity.visitor.IdentityVisitPlugin

remember_cookie_name = 'tg_remember_me'

class IdentityVisitPlugin(BaseIdentityVisitPlugin):
    '''
        Plugin for remember me functionality
    '''
    
    def __init__(self):
        self.remember_me_field = get( "identity.form.remember_me", "rememberme" )
        # Default name for remember me cookie
        self.remember_me_cookie_name = get( 'identity.remember_me.cookie.name', remember_cookie_name)
        self.remember_me_cookie_path = get( 'identity.remember_me.cookie.path','/')
        self.remember_me_cookie_domain = get( 'identity.remember_me.cookie.path', None)
        self.remember_me_enabled = get( 'identity.remember_me.on', True)
        super(IdentityVisitPlugin, self).__init__()
        if self.remember_me_enabled:
            self.identity_sources.append(self.identity_from_remember_me)

    def identity_from_remember_me( self, visit_key ):
        '''
            Inspect the remember me cookie to pull out identity information.
            Returns an identity dictionary or none if the cookie contained no identity
            information or the information was incorrect.

            @param visit_key: The visit key
            @return: An identity dictionary or none if the cookie contained no identity
            information or the information was incorrect.
        '''
        
        cookies = cherrypy.request.simple_cookie
        if self.remember_me_cookie_name in cookies:
            value = cookies[self.remember_me_cookie_name].value.split('\n')
            if len(value)!=2:
                return None
            user = User.select(User.c.user_name==value[0])[0]
            if sha.new(user.password).hexdigest() != value[1]:
                return None
            identity= self.provider.validate_identity( 
                    user_name=value[0], 
                    password = user.password, 
                    visit_key = visit_key )
            
            if identity is None:
                log.warning( "The credentials specified weren't valid" )
                return None

            return identity
        else:
            return None

    def identity_from_form( self, visit_key ):
        '''
            see also BaseIdentityVisitPlugin.identity_from_form
        '''
        
        identity = super(IdentityVisitPlugin, self).identity_from_form(visit_key)
        
        if (identity and self.remember_me_enabled and 
                        cherrypy.request.params.pop(self.remember_me_field, 'off')=='on'):
            self.send_remember_me_cookie(identity.user.user_name, identity.user.password)
        return identity

    def send_remember_me_cookie(self, user_name, password):
        '''
            Sends a remember me cookie back to the browser
        '''
        cookies = cherrypy.response.simple_cookie
        password = sha.new(password).hexdigest()

        cookies[self.remember_me_cookie_name] = user_name+'\n'+password
        cookies[self.remember_me_cookie_name]['path'] = self.remember_me_cookie_path
        gmt_expiration_time = time.gmtime(time.time() +
                (365 * 24 * 60 * 60))        #  1 year, in seconds
        cookies[self.remember_me_cookie_name]['expires'] = time.strftime(
                "%a, %d-%b-%Y %H:%M:%S GMT", gmt_expiration_time)
        if self.remember_me_cookie_domain:
            cookies[self.remember_me_cookie_name]['domain'] = self.remember_me_cookie_domain

        log.debug("Sending remember_me cookie")

    def identity_from_request(self, visit_key):
        '''
            Retrieve identity information from the HTTP request. Checks first for
            form fields defining the identity then for a cookie. If no identity
            is found, returns an anonymous identity.

            @param visit_key The visit key
            @return: A identity object
        '''
        identity= None
        log.debug( "Retrieving identity for visit: %s", visit_key )
        for source in self.identity_sources:
            identity= source(visit_key)
            if identity and not identity.anonymous:
                return identity

        log.debug( "No identity found" )
        # No source reported an identity
        identity= self.provider.anonymous_identity()
        return identity
        

# We now replace the framework class with our derived class.
identity.visitor.IdentityVisitPlugin = IdentityVisitPlugin

def clear_remember_me_cookie():
    '''
        Clears any remember me cookie.
    '''
    cookies= cherrypy.response.simple_cookie
    remember_me_cookie_name = get( 'identity.remember_me.cookie.name', remember_cookie_name)
    remember_me_cookie_path = get( 'identity.remember_me.cookie.path', '/')

    # clear the cookie
    log.debug( "Clearing remember_me cookie" )
    cookies[remember_me_cookie_name]= ''
    cookies[remember_me_cookie_name]['path']= remember_me_cookie_path
    cookies[remember_me_cookie_name]['expires']= 0
    