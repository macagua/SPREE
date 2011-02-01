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
    The controller for all interactions with the portal's boxes except the content box
'''
import turbogears

from turbogears import controllers, expose
from turbogears import identity

from sqlalchemy import *
from turbogears.database import session

import math
from spree.model import User, getNumberOfAllUsersCurrentlyOnline, getNumberOfAllUsers, UserStats
from spree.spree_model import Query, ChatSession, ChatMessage, QueryExpert, BlogEntry
from datetime import datetime
from spree.submodels.log_model import UserLog


class BoxesController(controllers.Controller, identity.SecureResource):
    '''
        The controller for all interactions with the portal's boxes except the content box 
    '''
    
    require = identity.not_anonymous();

    @expose(format="json", content_type="text/html; charset=UTF-8")
    def getQueries(self, *args, **kwargs):
        '''
            @return: information about queries and chats for in and out box needed for the template
        '''
        
        user_id = identity.current.user.user_id
        myQueries = session.query(Query).select(
                           Query.c.user_id == user_id,
                           order_by=[desc(Query.c.created)]
                   )
        
        queries = []
        
        #just for the logging purpose 
        still_online=datetime.now()
        user_log = session.query(UserLog).select(UserLog.c.user_id == user_id, limit=1, order_by=desc(UserLog.c.ulog_id))
        if user_log:
            user_log[0].last_polling=still_online
            session.flush()
        
        res_queries_out = []
        
        for query in myQueries:
            if len(res_queries_out) == 5:
                break
            
            if query.status == 'FINISHED':
                cs = query.chatSession
                if (cs.rating >0 or cs.status == "RATED"):
                    continue
                            
            # did the other side send the last chat entry for this query?
            status = "new"
            
            isOnline = True
            
            if query.status != 'OPEN':
                status = "myTurn"
                cs = query.chatSession
                cm = cs.getLastMessage()
                if cm and cm.user_id == user_id:
                    status = "notMyTurn"
                isOnline = cs.getExpert().isOnline()
            
            if query.status == "FINISHED":
                status = "finished"
                
            res_queries_out.append({
                        "type": "out",
                        "query_id":query.query_id,
                        "topic":query.getTopicString(True,200),
                        "status":status,
                        "in_out":"out",
                        "isOnline":isOnline}
            )
        
        res_queries_in = []

        #new queries        
        queries_incoming = union(
                                 Query.table.select(
                                     and_(
                                          Query.c.user_id != user_id,
                                          Query.c.status == "OPEN",
                                          QueryExpert.c.query_id == Query.c.query_id,
                                          QueryExpert.c.expert_id == user_id,
                                          QueryExpert.c.status != "DECLINED"
                                      ),
                                      order_by=[Query.table.c.created],
                                 ),
                                 Query.table.select(
                                          and_(
                                              ChatSession.c.query_id == Query.c.query_id,
                                              Query.c.status != 'FINISHED',                                              
                                              ChatSession.c.expert_id == user_id
                                          ),
                                          order_by=[Query.table.c.created],
                                  ),
                                  limit = 5                          
                          ).execute()
        
        if queries_incoming:
            for query in queries_incoming:
                status = "new"
                if query.status != 'OPEN':
                    cm = ChatMessage.select(
                            and_(
                                 ChatSession.c.query_id == query.query_id,
                                 ChatMessage.c.session_id == ChatSession.c.session_id
                                 ),
                            order_by=[desc(ChatMessage.c.created)]
                            )[0]
                    if cm.user_id == user_id:
                        status = "notMyTurn"
                    else:
                        status = "myTurn"
                        
                user = session.query(Query).get_by(Query.c.query_id==query.query_id).user

                if query.status == "FINISHED":
                    status = "finished"

                res_queries_in.append(
                    {
                       "created":query.created, #add just for the ordering of the queries
                       "type":"in",
                       "query_id":query.query_id,
                       "topic":session.query(Query).get_by(Query.c.query_id == query.query_id).getTopicString(False, 200),
                       "status":status,
                       "user":user.display_name,
                       "in_out":"in",
                       "isOnline":user.isOnline()
                   }
                )

        #in this way newest queries will come on top of the list, and the order won't change
        res_queries_in.sort()
        res_queries_in.reverse()
        
        return dict(queries_in = res_queries_in, queries_out=res_queries_out)        
                        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.boxes.query_details")
    def getQueryDetails(self, query_id, *args, **kwargs):
        '''
            Fetches query detailes.
            
            @param query_id: identifies query 
            @return: the query details for the tooltip 
        '''
        query = session.query(Query).get_by(query_id=int(query_id))
        user = session.query(User).get_by(user_id=query.user_id)
        
        return dict(topic=query.topic, text=query.text, user= user.display_name, created=query.created.strftime("%I:%M"))  
    
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.boxes.statistics")
    def getStatistics(self, *args, **kwargs):
        '''
            @return: statistics about the user for statistical box
        '''
        current_user = identity.current.user
        
        n_users = getNumberOfAllUsers();
        n_users_online = getNumberOfAllUsersCurrentlyOnline();
        
        n_queries = session.query(Query).count()
        n_chats = session.query(ChatSession).count(ChatSession.c.status == 'ONGOING');
        
        user=session.query(User).get_by(user_id=current_user.user_id)
        stats = user.user_stats
        n_answered = stats.no_of_ques_answered
        n_asked = stats.no_of_ques_asked
        
        n_blogs = session.query(BlogEntry).count(BlogEntry.c.user_id==current_user.user_id)
       
        name = current_user.user_name[:25]
        if not " " in name:
            name = name[:15]
            
        return dict(user_name = name,
                    n_users = n_users, 
                    n_users_online = n_users_online,
                    n_queries = n_queries,
                    n_chats = n_chats,
                    n_answered = n_answered,
                    n_asked = n_asked,
                    n_blogs = n_blogs
                    )
        
