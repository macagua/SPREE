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
    The root controller containing all other controllers
    and login, help and about functionality
'''
import logging

import cherrypy
from sqlalchemy import and_
import turbogears
from turbogears import controllers, expose, validate, redirect
from turbogears import identity, config
from turbogears.database import session

from datetime import datetime, timedelta
from time import strftime , gmtime, time
from spree import json
from spree import register_controllers
from spree.subcontrollers import content_controller, boxes_controller, profile_controller, datainitializer, feed_controller, admin_controller, statistics_controller, gadget_controller
from spree.submodels.log_model import UserLog
from spree.submodels import stopword_model, tree_model
from spree.util.cherrypy.url import getServerUrl, getWebpath
import spree.visit_plugin

from spree import visit_plugin

log = logging.getLogger("spree.controllers")

class Root(controllers.RootController):
    '''
        This is a father class of all controllers and provides login, help and about functionality.
        
        Subcontrollers:
        
        registration   - the registration subcontroller
        content        - the controller(s) for actions related to the main content box
        boxes          - the controller related to the smaller boxes (i/o-boxes etc.)
        profile        - the controller related to the user's expertise (tree widget etc.)
        feed           - the rss feed controller
        gadget         - the google gadget controller
        admin          - a controller for administrative access
        statistics     - a controller providing statistical data
    '''    
    registration = register_controllers.UserRegistration()
    content      = content_controller.ContentController()
    boxes        = boxes_controller.BoxesController()
    profile      = profile_controller.ProfileController()
    feed         = feed_controller.NewsFeedController()
    gadget       = gadget_controller.GadgetController()
    admin        = admin_controller.AdminController()
    statistics   = statistics_controller.StatisticsController()    
    
    @expose(template="spree.templates.portal", content_type="text/html; charset=UTF-8")
    def index(self, forward_url=None, previous_url=None, *args, **kw):
        '''
            The main url. Checks whether user is logged in or remembered and forwards
            to the right url.
        '''
        
        #if unknown than go to login
        if identity.current.anonymous:
            raise redirect("/login")       
            
        msg = "Welcome %s" %identity.current.user.user_name
        
        # add an expire flag to the site so it is always reloaded
        # otherwise IE caches it and shows the site even when disconnected
        
        time_fmt = '%a, %d %b %Y %H:%M:%S GMT'
        cache_seconds = 0 
        now = time()
        
        #set expire headers. Main page is not cached
        cherrypy.response.headerMap['Last-Modified'] = strftime(time_fmt, gmtime(now))
        cherrypy.response.headerMap['Expires'] = strftime(time_fmt, gmtime(now + cache_seconds)) 
        
        #calculate url to google gadget.
        webpath = config.get("server.webpath","")
        gadget_path = config.get("gadgetpath","/gadget/getGadget")
        gadget_address = 'http://www.google.com/ig/adde?moduleurl='+getServerUrl() + webpath + gadget_path
        
        isProd = turbogears.config.get("server.environment") == "production"

        return dict(message=msg, user_name = identity.current.user.user_name, isProd = isProd, gadget_address=gadget_address)
    
    @expose(template="spree.templates.login_main")
    def login(self, forward_url=None, *args, **kw):
        '''
            Allows user to log in. Checks for validity of entered data and takes care of invalid cases.
            Also takes care of remember me check box value.
        '''
        
        msg=_("Welcome to SPREE. Please supply your credentials...")
         
        if not identity.current.anonymous \
                    and identity.was_login_attempted() \
                    and not identity.get_identity_errors():
                    #loged for the first time
                    self.onLogin()
                    raise redirect("/")

        rememberme = 'rememberme' in kw and str(kw.pop('rememberme','on')) == 'on'
        if rememberme:
            rememberme = {'checked':'true'}
        else:
            rememberme = {}
            

        forward_url=None
        previous_url= cherrypy.request.path

        if identity.was_login_attempted() and identity.current.anonymous:
            msg=_("The credentials you supplied do not grant access to this resource.")
        elif identity.get_identity_errors():
            msg=_("You must provide your credentials before accessing "
                   "this resource.")
        elif identity.current.anonymous:
            msg=_("To enter the SPREE community please provide your credentials...")
            forward_url = cherrypy.request.headers.get("Referer", "/")

        cherrypy.response.status=403
            
        return dict(previous_url=previous_url,message=msg,forward_url=forward_url,
                    original_parameters=cherrypy.request.params,rememberme=rememberme)
    
    @expose(template="spree.templates.login_about")
    def about(self, *args, **kwargs):
        '''
            Serves about page.
        '''
        
        page = int(kwargs.get("page","1"))
        
        return dict(page = page)    

    @expose(template="spree.templates.help")
    def help(self, *args, **kwargs):
        '''
            Serves help page.
        '''
        
        page = int(kwargs.get("page","1"))
        
        return dict(page = page)
        
    @expose()
    def logout(self):
        '''
            Logs user out. The action of user's logout is further logged in a user_log table.
        '''
        
        #user was already logged out
        if not identity.current.user:
            log.info("logout")
            raise redirect("/")
        
        try:
            user_log=UserLog.select(and_(UserLog.c.user_id==identity.current.user.user_id, UserLog.c.logout_time==None))
            m=0
            i=-1
            for u in user_log:
                if u.ulog_id>m:
                    m=u.ulog_id
                    i=user_log.index(u)

            user_log[i].logout_time=datetime.now()
            session.save(user_log)
            session.flush()
        except:
            pass
        
        # delete all existing sessions
        # this way a user that is logged in with multiple browsers gets logged out
        # everywhere
        from spree.model import VisitIdentity
        visists = VisitIdentity.select(VisitIdentity.c.user_id == identity.current.user.user_id)
        for v in visists:
            v.delete()
        identity.current.logout()
        
        # delete rememberme cookie
        visit_plugin.clear_remember_me_cookie()
        
        log.info("logout")
        raise redirect("/")
    
    def onLogin(self):
        '''
            Upon user's login user receives cookie. The action of user's logint is further logged in a user_log table.
        '''
        
        user_log=UserLog()
        user_log.user_id=identity.current.user.user_id
        user_log.user_name=identity.current.user.user_name
        user_log.login_time=datetime.now()
        session.save(user_log)
        
        cookiename = visit_plugin.remember_cookie_name
        
        session.flush()
          
