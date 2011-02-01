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
    The content controller used for swapping the content templates
'''
    
import turbogears

from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler

from sqlalchemy import *
from turbogears.database import session

from spree import register_model
from spree import json
from spree.register_controllers import UserRegistration 

from spree.model import User
from spree.spree_model import Query, ChatSession
from spree.subcontrollers import chat_controller, search_controller, blog_controller, feedback_controller, im_controller


class ContentController(controllers.Controller, identity.SecureResource):
    '''
        The content controller used for swapping the content templates
    '''
    
    chat = chat_controller.ChatController()
    search = search_controller.SearchController()
    blog = blog_controller.BlogController()
    feedback=feedback_controller.FeedbackController()
    im=im_controller.IMController()
                
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.chat")
    @identity.require(identity.not_anonymous())
    def getChatComponent(self, *args, **kwargs):
        '''
            Returns the chat template
            @deprecated
        '''
        
        return dict()
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.profile")
    def getProfileComponent(self, *args, **kwargs):
        '''
            Returns the profile template and forwards any given arguments
        '''
        
        return kwargs
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.preferencesPersonal")
    def getPreferencesComponent(self, *args, **kwargs):
        '''
            Forwards the request to UserRegistration().edit_user() and 
            returns the filled content.preferencesPersonal template
        '''
        
        return UserRegistration().edit_user()
    