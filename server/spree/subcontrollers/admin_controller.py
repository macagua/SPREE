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
    Provides some internal status functions
'''
import turbogears
from turbogears import controllers, expose, identity

from turbogears.database import metadata, session
from sqlalchemy import *
from spree import json
from spree.model import User


def checkPrivilege():
    '''
        Allows only certain users to have access to emaiList method.
    '''
    if identity.current.user.user_name in ['milena','robert','winfried','mitra'] :
        return True
    else:
        return False

class AdminController(controllers.Controller, identity.SecureResource):
    
    require = identity.not_anonymous()
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.elist")
    def emailList(self):
        '''
            @return: a list of email addresses of the users that have provided one.
        '''

        if checkPrivilege():
            user_list = session.query(User).select(User.c.email_address.like('%@%'))
            email_list=[]
            for u in user_list:
                email_list.append(u.email_address)
               
            return dict(email_list=email_list)
        else:
            return dict(email_list={})
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.elist")
    def getUsersOnline(self):
        '''
            @return: a list of email addresses of the users currently online.
        '''
        if checkPrivilege():
            user_list = session.query(User).select(User.c.email_address.like('%@%'))
            email_list=[]
            for u in user_list:
                if u.isOnline():
                    email_list.append(u.email_address)
               
            return dict(email_list=email_list)
        else:
            return dict(email_list={})
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.elist")
    def newsletterList(self):
        '''
            @return: a list of email addresses of the users who want to receive newsletter
        '''

        if checkPrivilege():
            user_list = session.query(User).select(User.c.email_address.like('%@%'))
            email_list=[]
            for u in user_list:
                if u.settings and u.settings.newsletter==1:
                    email_list.append(u.email_address)

            return dict(email_list=email_list)
        else:
            return dict(email_list={})
        
        
    
        



