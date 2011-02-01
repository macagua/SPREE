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
    Controller for google gadget
'''

import datetime

from sqlalchemy import *
from cherrypy.filters.basefilter import BaseFilter
import cherrypy, sha
from turbogears.feed import FeedController
from turbogears import identity,controllers, expose, config
from turbogears.visit import api as visitapi
from turbogears.database import session

from spree.model import User, Visit, VisitIdentity
from spree.util.cherrypy.url import getServerUrl
from spree.spree_model import Query,QueryExpert,query_expert_table, ChatSession, ChatMessage


class GadgetController(FeedController):
    '''
        Add the filter to cherrypy's filter list.
    '''
    
#    _cp_filters = [Xmlfilter()]

    
    @expose(template="spree.templates.ig", format="xml", content_type="application/xml")
    def ig(self, **kwargs):
        '''
            Returns the google gadget
        '''
        feed = self.get_ig(**kwargs)
        self.format_dates(feed, 822)
        self.depr_entrys(feed)
        return feed
    
    @expose(template="spree.templates.ig", format="xml", content_type="application/xml")
    def ig_pass(self, **kwargs):
        '''
            Returns the google gadget
        '''
        feed = self.get_ig_pass(**kwargs)
        self.format_dates(feed, 822)
        self.depr_entrys(feed)
        return feed
    
    def get_ig_pass(self, **kwargs):
        '''
            Prepares content to be served in google gadget. If not personalized gadget is going to display 
            five latest questions posted on the Spree system, excluding direct questions. If personalized, 
            gadget is going to display latest questions and ongoing chats for a given user. The icons, 
            that are situation dependent, are also assigned to each entry. The content of the question 
            summery is limited to 200 characters.
        
            @param kwargs: if user_name is provided, content can be personalized
            @return: values needed for the template
         '''
         
        entries = []
        valid_name=1

        if not kwargs:
            user_name = ''
        else:
            user_name=kwargs.get('user_name','')
        if user_name != '':
            u=session.query(User).get_by(User.c.user_name==str(user_name))
            if u:
                pass
            else:
                user_name = ''
                valid_name=-1

        server_address=getServerUrl()+'/'
        
        if valid_name==1 and self.validateUser(**kwargs).lower().find('failure') < 0:
            if user_name == '':

                new_questions=session.query(Query).select(and_(
                                     Query.c.status == "OPEN",
                                     Query.c.isDirect == 0),
                                     order_by=[desc(Query.c.created)],
                                     limit=5
                           )
            else:
                
                if not u.isOnline():
                    visit_key = visitapi.current().key
                    cherrypy.request.identityProvider.validate_identity(user_name, u.password, visit_key)
                else:
                    myvisit = select([Visit.c.visit_key], and_(Visit.c.visit_key == VisitIdentity.c.visit_key,
                                                               VisitIdentity.c.user_id == u.user_id),
                                   order_by=[desc(Visit.c.created)]).execute().fetchone()
                    visitapi._manager.visit_for_key(myvisit.visit_key)
                
                handshakes = session.query(QueryExpert).select(and_(
                            QueryExpert.c.expert_id == u.user_id,
                            QueryExpert.c.status=='HANDSHAKE'))

                new_questions = session.query(Query).select(Query.c.query_id.in_(*[row.query_id for row in handshakes]))
                
                #view status of chats
                chats=session.query(ChatSession).select(and_(ChatSession.c.expert_id==u.user_id,or_(ChatSession.c.status=='ONGOING',ChatSession.c.status=='HANDSHAKE')))
                for cs in chats:
                    foo = {}
                    foo["acreated"] = cs.created
                    foo["title"] = cs.query.getTopicString(False)
                    foo["author"] = User.select(User.c.user_id == cs.user_id)[0].display_name
                    foo["summary"] = cs.query.text[:200]
                    foo["id"] = server_address
                    cm=session.query(ChatMessage).select(ChatMessage.c.session_id==cs.session_id, order_by=desc(ChatMessage.c.created))

                    if cm[0].user_id==u.user_id:
                        myTurn=True
                    else:
                        myTurn=False
                    isOnline = cs.getUser().isOnline()
                    if isOnline:
                        if myTurn:
                            foo["image"]=server_address+"static/images/chatpartner_online.gif"
                            status='myTurn_online'
                        else:
                            foo["image"]=server_address+"static/images/open_chat_online.gif"
                            status='myTurn_offline'
                    else:
                        if myTurn:
                            foo["image"]=server_address+"static/images/chatpartner_offline.gif"
                            status='notMyTurn_online'
                        else:
                            foo["image"]=server_address+"static/images/open_chat_offline.gif"
                            status='notMyTurn_offline'

                    foo["status"]=status
                    entries.append(foo)

            for query in new_questions:
                foo = {}
                usr=User.select(User.c.user_id == query.user_id)[0]
                foo["acreated"] = query.created
                foo["title"] = query.getTopicString(False)
                foo["summary"] = query.text[:200]
                foo["author"] = usr.display_name
                foo["id"] = server_address
                isOnline = usr.isOnline()
                if isOnline:
                    foo["image"]=server_address+"static/images/newquery_online.gif"
                    foo["status"]='new_online'
                else:
                    foo["image"]=server_address+"static/images/newquery_offline.gif"
                    foo["status"]='new_offline'
                entries.append(foo)

        #entries are ordered by their time stemps
        for e in entries:
            e=e.items()
            e.sort()

        entries.sort()
        entries.reverse()

        entries_add=[]
        for e in entries:
            entries_add.append(dict(e))

        entries=[]
        entries=entries_add
        
        dic = dict(
            link=server_address,
            valid_name=valid_name,
            entries=entries
        )

        return dic

    def get_ig(self, **kwargs):
        '''
            Prepares content to be served in google gadget. If not personalized gadget is going to display 
            five latest questions posted on the Spree system, excluding direct questions. If personalized, 
            gadget is going to display latest questions and ongoing chats for a given user. The icons, 
            that are situation dependent, are also assigned to each entry. The content of the question 
            summery is limited to 200 characters.
        
            @param kwargs: if user_name is provided, content can be personalized
            @return: values needed for the template
         '''
         
        entries = []
        valid_name=1

        if not kwargs:
            user_name = ''
        else:
            user_name=kwargs.get('user_name','')
        if user_name != '':
            u=session.query(User).get_by(User.c.user_name==str(user_name))
            if u:
                pass
            else:
                user_name = ''
                valid_name=-1

        server_address=getServerUrl()+'/'
        
        if valid_name==1:
            if user_name == '':

                new_questions=session.query(Query).select(and_(
                                     Query.c.status == "OPEN",
                                     Query.c.isDirect == 0),
                                     order_by=[desc(Query.c.created)],
                                     limit=5
                           )
            else:
                
                handshakes = session.query(QueryExpert).select(and_(
                            QueryExpert.c.expert_id == u.user_id,
                            QueryExpert.c.status=='HANDSHAKE'))

                new_questions = session.query(Query).select(Query.c.query_id.in_(*[row.query_id for row in handshakes]))

                #view status of chats
                chats=session.query(ChatSession).select(and_(ChatSession.c.expert_id==u.user_id,or_(ChatSession.c.status=='ONGOING',ChatSession.c.status=='HANDSHAKE')))
                for cs in chats:
                    foo = {}
                    foo["acreated"] = cs.created
                    foo["title"] = cs.query.getTopicString(False)
                    foo["author"] = User.select(User.c.user_id == cs.user_id)[0].display_name
                    foo["summary"] = cs.query.text[:200]
                    foo["id"] = server_address
                    cm=session.query(ChatMessage).select(ChatMessage.c.session_id==cs.session_id, order_by=desc(ChatMessage.c.created))

                    if cm[0].user_id==u.user_id:
                        myTurn=True
                    else:
                        myTurn=False
                    isOnline = cs.getUser().isOnline()
                    if isOnline:
                        if myTurn:
                            foo["image"]=server_address+"static/images/chatpartner_online.gif"
                            status='myTurn_online'
                        else:
                            foo["image"]=server_address+"static/images/open_chat_online.gif"
                            status='myTurn_offline'
                    else:
                        if myTurn:
                            foo["image"]=server_address+"static/images/chatpartner_offline.gif"
                            status='notMyTurn_online'
                        else:
                            foo["image"]=server_address+"static/images/open_chat_offline.gif"
                            status='notMyTurn_offline'

                    foo["status"]=status
                    entries.append(foo)

            for query in new_questions:
                foo = {}
                usr=User.select(User.c.user_id == query.user_id)[0]
                foo["acreated"] = query.created
                foo["title"] = query.getTopicString(False)
                foo["summary"] = query.text[:200]
                foo["author"] = usr.display_name
                foo["id"] = server_address
                isOnline = usr.isOnline()
                if isOnline:
                    foo["image"]=server_address+"static/images/newquery_online.gif"
                    foo["status"]='new_online'
                else:
                    foo["image"]=server_address+"static/images/newquery_offline.gif"
                    foo["status"]='new_offline'
                entries.append(foo)

        #entries are ordered by their time stemps
        for e in entries:
            e=e.items()
            e.sort()

        entries.sort()
        entries.reverse()

        entries_add=[]
        for e in entries:
            entries_add.append(dict(e))

        entries=[]
        entries=entries_add
        
        dic = dict(
            link=server_address,
            valid_name=valid_name,
            entries=entries
        )

        return dic
    
    @expose()
    def validateUser(self, **kwargs):
        '''
            Validates the credentials given in kwargs.
            
            @param user_name User name
            @param password Users password
            
            @return 'failure' if credentials could not be validated and an empty string
                    if validation was successfull
        '''
        user_name = kwargs.get('user_name',None)
        password = kwargs.get('password',None)
        
        if not user_name or not password:
            return 'failure'
        
        u = session.query(User).get_by(User.c.user_name==str(user_name))
        
        failure = sha.new(u.password).hexdigest() != password
        
        if failure:
            return 'failure'
        
        #visit_key = visit.current().key
        #visit._manager.validate_identity(user_name, u.password, visit_key)
        
        return ''
        
    @expose()
    def getGadget(self, **kwargs):
        '''
            @return: the xml file needed for the google gadget
        '''
        server_address=getServerUrl()+'/'
        screenshot_location=server_address+"static/images/screenshot.png"

        from genshi.template import TemplateLoader
        #get the template
        loader = TemplateLoader(['spree/templates/'])
        tmpl = loader.load('spree_gadget.html')
        #fill the template
        stream = tmpl.generate(screenshot_location=screenshot_location, server_address=server_address)
        str = stream.render()

        cherrypy.response.headers['Content-Type'] = 'application/xml'
        cherrypy.response.body = '<?xml version="1.0" encoding="UTF-8"?>\n'
        cherrypy.response.body += str        
        
        return cherrypy.response.body

        
        
        
