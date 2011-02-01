from __future__ import division
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
    The instant messenger content controller.
'''

import turbogears, cPickle, threading, pkg_resources

from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler

from turbogears.database import metadata, session

from sqlalchemy import *
from genshi.core import Markup

from spree.model import User, UserStats, getUsersCurrentlyOnline
from spree.spree_model import ChatSession, QueryExpert, Query
from spree.submodels.log_model import QueryLog
import spree.constants as constants

from spree.util import helpers

class IMController(controllers.Controller, identity.SecureResource):
    '''
        The instant messenger content controller.
    '''
        
    require = identity.not_anonymous();    
    
    # new content
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.im")    
    def getImContent(self, *args, **kwargs):
        new_text = "Here you are, New Content. "
        return dict(new_text = new_text)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.im_users")
    def getUsers(self, *args, **kwargs):
        '''
            Serves a list of all the users. Online users are listed first.
            
            @return: values needed for the template
        '''
        users = list(User.select(User.c.user_id != identity.current.user.user_id))        
        onlineIds = getUsersCurrentlyOnline()
        
        pageSize = constants.no_imusers_per_page
        showPage = int(kwargs.get('showPage',1))
        pagesCount = int(len(users) / pageSize) + 1
        offset = showPage * pageSize - pageSize
        limit = min(offset + pageSize ,len(users))
        
        ret = {'users':[],
               'pageSize':pageSize,
               'currentPage':showPage,
               'pagesCount':pagesCount,
               'offset':offset,
               'limit':limit,
               'totalUsersCount':len(users)}
        
        count = 0
        for user in users:
            entry = {}
            entry['name'] = user.display_name[:20]
            entry['id'] = user.user_id
            entry['isonline'] = user.user_id in onlineIds
            _class = ""
            if (entry['isonline']):
                _class += "online"
            else:
                _class += "offline"
                
            if count % 2 == 0:
                _class += " even"
            else:
                _class += " odd"
            entry['_class'] = _class
            ret['users'].append(entry)
            
            count += 1

        ret['users'].sort(lambda x,y: -10 * cmp(x['isonline'],y['isonline']) + cmp(x['name'].lower(), y['name'].lower()))
        
        ret['users'] = ret['users'][offset:limit]

        return ret
    
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.im_userDetails")
    def getUserDetails(self, user_id, *args, **kwargs):
        '''
            Serves details for the selected user.
            
            @param user_id: needed to identify the user
            @return: values needed for the template
        '''
        
        limit=constants.max_openQueries
        user = User.get_by(User.c.user_id == int(user_id))
        
        if not user:
            return dict(name="", status="", rank="", score="", answers="", expertise="")
            
        stats = user.user_stats
        user_score= stats.score
        n_answered = stats.no_of_ques_answered
        n_asked = stats.no_of_ques_asked
        
        rank=user.getRank()
        
        status = "offline"
        if user.isOnline():
            #status ="<b>online<b/>"
            status = "online"
        
        exps = user.getExpertiseAsText()
        exps.sort()
        
        expertise = ""
        for exp in exps:
            expertise += exp +"<br/>"
            
        openQueryCount = session.query(Query).count(
                                        and_(
                                            Query.c.user_id == user.user_id,
                                            Query.c.status != 'FINISHED'                                                        
                                        )
        )
        
        unratedQueryCount = session.query(ChatSession).count(
                                 and_(
                                      ChatSession.c.user_id == user.user_id,
                                      ChatSession.c.rating == 0,
                                      ChatSession.c.status == "FINISHED"
                                  )                                                             
                             )
        
        #print openQueryCount, unratedQueryCount
        
        isFull = True
        #show warning when to many queries are still open
        if not openQueryCount + unratedQueryCount >= limit:
            isFull = False
            
        print openQueryCount, unratedQueryCount
        
        return dict(id=user.user_id, 
                    name=user.display_name, 
                    status=status, 
                    rank=rank, 
                    score=user_score, 
                    answers=n_answered, 
                    expertise=Markup(expertise),
                    isFull = isFull)
        
    @expose(format="json")
    def doDirectChat(self, *args, **kwargs):
        ''' 
            Allowes a user to start a direct chat with one of the listed experts. 
            If expert is overloaded direct chat is not enabled.
            
            @param **kwargs: contains topic, query and expertid
            @return: query_id
        '''
        
        topic = kwargs.get('topic','')[:50]
        text = kwargs.get('query','')[:16250]
        expertid = kwargs['expertid']
        
        expert = session.query(User).get_by(user_id = int(expertid))
        ongoingChatCount = session.query(ChatSession).count(
                                                    and_(
                                                        ChatSession.c.expert_id == int(expertid),
                                                        ChatSession.c.status != 'FINISHED',
                                                        ChatSession.c.status != 'RATED'                                                      
                                                    )
                        )
        openQueryCount = session.query(QueryExpert).count(
                                                    and_(
                                                        QueryExpert.c.expert_id == int(expertid),
                                                        QueryExpert.c.status == 'HANDSHAKE'                                                    
                                                    )
                        )
        
        if not ongoingChatCount + openQueryCount < constants.max_openQueries:
            return {"failure":True}
        
        print topic
        q = Query(user_id = identity.current.user.user_id, 
                  text= text,
                  topic = topic,
                  status='OPEN')
        
        user=session.query(User).get_by(user_id = identity.current.user.user_id)
        
        q.isDirect = 1
         
        q.experts = [expert]
        q.profile = cPickle.dumps([])
        
        session.save(q)
        session.flush()
        
        query_log=QueryLog(
            user_id=user.user_id,
            user_name=user.user_name,
            status='New',
            query_id=q.query_id)
            
        session.save(query_log)
        session.flush()
            
        # send emails to the contacted expert (if wanted) in a different thread
        from spree.util.cherrypy import url
        baseUrl = url.getServerUrl()
        #threading.Thread(target=q.informExperts, args=[baseUrl]).start() 
        
        q.informExperts([baseUrl])

        return dict(query_id = q.query_id)
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.im_expertFull")
    def directChatFull(self, *args, **kwargs):
        '''
            give feedback when the contacted user already has enough incoming questions
        '''
        return {}
