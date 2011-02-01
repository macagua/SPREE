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
        The controller for the chat content box.
'''

import turbogears
import re, cPickle

from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler

from sqlalchemy import *
import datetime

from turbogears.database import session

from spree import register_model
from spree import json

from spree.model import User
from spree.spree_model import Query, ChatSession, ChatMessage, QueryExpert, BlogEntry
from spree.submodels import tree_model
from spree.util import helpers

from genshi.core import Markup
import spree.constants as constants
from datetime import datetime
from spree.submodels.log_model import ChatLog, QueryLog

class ChatController(controllers.Controller, identity.SecureResource):
    '''
        The controller for the chat content box.
    '''

    require = identity.not_anonymous();

    # join the chat (user+expert)

    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.chat")
    def join(self, query_id, *args, **kwargs):
        '''
            Joins user and expert into a chat session.
            Logging about chat and query gets updated.
            
            @param query_id: chat evolves from a query 
            @return: values needed for the template
        '''
        ongoingSessions = ChatSession.count(ChatSession.c.query_id == int(query_id))

        if ongoingSessions==0:
            query = session.query(Query).get_by(query_id=int(query_id))
            if not query:
                raise redirect("/content/search/getQueryOverviewContent/"+query_id)
            
            query.status='HANDSHAKE';

            cs = ChatSession(
                 query_id = int(query_id),
                 user_id = query.user_id,
                 expert_id = identity.current.user.user_id,
                 status='HANDSHAKE',
                 text='',
                 rating=-1)
                 
            chat_log = ChatLog(
                 query_id = cs.query_id,
                 user_id = cs.user_id,
                 user_name = session.query(User).get_by(user_id=cs.user_id).user_name,
                 expert_id = cs.expert_id,
                 expert_name = session.query(User).get_by(user_id=cs.expert_id).user_name,
                 exp_accepted = datetime.now())
                 
            
            query_log = QueryLog(
                query_id=cs.query_id,
                user_id=cs.expert_id,
                user_name=session.query(User).get_by(user_id=cs.expert_id).user_name,
                status='Accepted',
                created=datetime.now())
            session.save(query_log)
            #session.flush()
            
            query.experts = []
            expert=session.query(User).get_by(user_id=int(cs.expert_id))
            
            if query.isDirect == 0:
                expert.user_stats.no_of_ques_answered+=1

            session.save(query);
            session.save(chat_log)
            session.flush();

        #get session
        cs = ChatSession.select(ChatSession.c.query_id==query_id)[0];
        isUser = cs.user_id == identity.current.user.user_id
        isExpert = cs.expert_id == identity.current.user.user_id

        if not isUser and not isExpert:
            raise redirect("/content/search/getQueryOverviewContent/"+query_id)

        # If expert created a note entry        
        blogCount = BlogEntry.count(BlogEntry.c.query_id==cs.query_id)
        existsBlog = blogCount >0;
        if existsBlog:
            be = session.query(BlogEntry).get_by(query_id=int(cs.query_id))
            blogentry_id = be.blogentry_id;
        else:
            blogentry_id = -1;
               
        text = "__joined chat";
        if isExpert and cs.status=='HANDSHAKE':
            cmsCount = ChatMessage.count(ChatMessage.c.session_id==cs.session_id)
            if cmsCount==0:
                text = "__Query accepted. Please wait for user to join chat...."

                # create new "joined" message
                cm = ChatMessage(session_id=cs.session_id,
                                 user_id = identity.current.user.user_id,
                                 type = "JOINED",
                                 text = text)

        # label query for consistency
        query = session.query(Query).get_by(query_id=cs.query_id)

        if (cs.status=='HANDSHAKE') and isUser:
            cs.status = 'ONGOING'
            query.status = 'CHAT'
            query.experts = []

            # create new "joined" message
            cm = ChatMessage(session_id=cs.session_id,
                 user_id = identity.current.user.user_id,
                 type = "JOINED",
                 text = text)

            chat_log=session.query(ChatLog).get_by(ChatLog.c.query_id==cs.query_id)
            chat_log.user_joined=datetime.now()

            session.save(query);
            session.save(cm);
            session.save(cs);

        session.flush();

        messages = ChatMessage.select(
                      and_(
                          ChatSession.c.query_id==int(query_id),
                          ChatSession.c.session_id==ChatMessage.c.session_id
                      ),
                      order_by=ChatMessage.c.created)
        
        chat_entries = []
        
        htmlText = "<b>" + query.getTopicString(isUser) + "</b>\n" + query.text + "\n" + "<b>Categories:</b>" + query.getCategoriesString()
        htmlText = htmlText.replace("\n","<br/>")
        
        chat_entries.append({"id":-1,
                         "date": query.created.strftime("%H:%M"),
                         "user": session.query(User).get_by(user_id=query.user_id).display_name[:20],
                         "text": Markup(htmlText)})
        
        chat_entries.extend(
                            [{
                                "id":m.chat_message_id,
                                "date":m.created.strftime("%H:%M"),
                                "user":session.query(User).get_by(user_id=m.user_id).display_name[:20],
                                "text":Markup(m.text.replace("\n","<br/>"))
                            } for m in messages]
        )

        last_entry_id = -1 #messages[-1].chat_message_id;

        status = cs.status
        if cs.rating and cs.rating >= 0:
            status = "RATED"
        
        myName = None
        if isExpert:
            username = session.query(User).get_by(user_id = cs.user_id).display_name[:20]
            expertname = session.query(User).get_by(user_id = cs.expert_id).user_name[:20]
            myName = expertname
        else:
            username = session.query(User).get_by(user_id = cs.user_id).user_name[:20]
            expertname = session.query(User).get_by(user_id = cs.expert_id).display_name[:20]
            myName = username

        return dict(query_id=query_id,
                    topic=query.topic,
                    query=query.text[:60],
                    isDirect=query.isDirect,
                    session_status = status,
                    isExpert = isExpert,
                    blogentry_id = blogentry_id,
                    existsBlog = existsBlog ,
                    chat_entries = chat_entries,
                    last_entry_id = last_entry_id,
                    rating = cs.rating,
                    time = helpers.formatDate(cs.created),
                    username = username,
                    expertname = expertname,
                    user_id = cs.user_id,
                    expert_id = cs.expert_id,
                    myName = myName)
                    

    @expose(format="json", content_type="text/html; charset=UTF-8")
    def getAllEntries(self, query_id, last_entry_id, *args, **kwargs):
        '''
            Fetches all or just the newes chat messages, starting from last_entry_id,
            belongeng to the same chat session.
            
            @param query_id: each chat session is conected to one query
            @param last_entry_id: if set to -1 all chat messages are fetched
            @return: chat messages and status of the chat
        '''
        messages = ChatMessage.select(
                      and_(
                          ChatSession.c.query_id==int(query_id),
                          ChatSession.c.session_id==ChatMessage.c.session_id,
                          ChatMessage.c.chat_message_id > int(last_entry_id)
                      ),
                      order_by=ChatMessage.c.created)

        cs = ChatSession.select(ChatSession.c.query_id==query_id)[0];

        chat_entries = [{"id":m.chat_message_id,
                         "date":m.created.strftime("%H:%M"),
                         "user":session.query(User).get_by(user_id=m.user_id).display_name[:20],
                         "text":m.text,
                         "byMe":m.user_id == identity.current.user.user_id} for m in messages]
        
        status = cs.status
        if cs.rating and cs.rating >=0:
            status = "RATED"

        last_entry_id_new = int(last_entry_id);
        if len(messages) > 0:
            last_entry_id_new = messages[-1].chat_message_id;

        return dict(chat_entries = chat_entries, session_status = status)

    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def send(self, query_id, *args, **kwargs):
        '''
            Posts a chat message.
            
            @param query_id: needed to identify chat session to which chat message should be appended
            @param **kwargs: contains the text of the message
        '''
        cs = ChatSession.select(ChatSession.c.query_id==query_id)[0];

        text = ""
        try:
            text = kwargs["text"]
            text = re.sub("http://\S+","<a href=\"\g<0>\" target=\"_blank\">\g<0></a>",text);
            text = re.sub("(?<!http://)www\.\S+","<a href=\"http://\g<0>\" target=\"_blank\">\g<0></a>",text);
        except:
            print "No text send in chat"
            pass

        #limit to field max size
        text = text[:2000]
        
        cm = ChatMessage(session_id=cs.session_id,
                         user_id = identity.current.user.user_id,
                         type = "POSTED",
                         text = text)
        session.flush();
        return dict()


    # finish the chat
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def finish(self, query_id, *args, **kwargs):
        '''
            Wreps up the finished chat.
            
            @param query_id: needed to identify chat session 
        '''
        cs = ChatSession.select(ChatSession.c.query_id==query_id)[0]
        query = Query.select(Query.c.query_id==cs.query_id)[0]

        cs.status = 'FINISHED'
        if query.isDirect == 1:
            cs.status = 'RATED'

        cm = ChatMessage(session_id=cs.session_id,
                         user_id = identity.current.user.user_id,
                         type = "FINISHED",
                         text = "__ends the chat")

        query.status="FINISHED"
        query.experts = []
        
        try:
            chat_log=session.query(ChatLog).get_by(ChatLog.c.query_id==cs.query_id)
            chat_log.chat_ended=datetime.now()
            if cm.user_id==chat_log.user_id:
                chat_log.who_ended='User'
            else:
                chat_log.who_ended='Expert'
            session.save(chat_log)
        except:
            pass

        session.save(cm)
        session.save(cs)
        session.save(query)

        session.flush()
        return dict()

    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def rate(self, query_id, rating, *args, **kwargs):
        '''
            Rates the chat. Updates user score and statistics.
            
            @param query_id: needed to identify chat session 
            @param rate:  points given
        '''
        cs = ChatSession.select(ChatSession.c.query_id==query_id)[0];

        if not cs.user_id == identity.current.user.user_id:
            return dict()

        cs.rating = int(rating)
        cs.status = "RATED"
        
        session.save(cs);
        session.flush();

        expert=session.query(User).get_by(user_id=int(cs.expert_id))
        
        stats = expert.user_stats

        new_value=round(stats.average_rating*stats.no_of_ques_answered_rated)
        stats.no_of_ques_answered_rated+=1
        stats.average_rating=(new_value+float(rating))/stats.no_of_ques_answered_rated
        stats.score=round(stats.no_of_ques_answered_rated * stats.average_rating + stats.no_of_blog_ratings * stats.average_blog_rating)
        session.flush();

        return dict()


    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.allchats")
    def getChatOverviewContent(self, *args, **kwargs):
        '''
            Fetches chat sessions from chat history of the user (as a user and/or expert). 
            Takes care of paginate, too.
            
            @return: values needed for the template
        '''
        
        user_id = identity.current.user.user_id
        
        #limit is setting how many entries are going to be displayed per page
        limit=constants.n_of_chats_per_page
        length=session.query(ChatSession).count_by(and_(or_(ChatSession.c.expert_id == user_id,
                                            ChatSession.c.user_id == user_id),
                                            or_(
                                                ChatSession.c.status == "FINISHED",
                                                ChatSession.c.status == "RATED"
                                            )))
        number_expert=session.query(ChatSession).count_by(
                                    and_(ChatSession.c.expert_id == user_id,
                                            or_(
                                                ChatSession.c.status == "FINISHED",
                                                ChatSession.c.status == "RATED"
                                            )
                                    )
                                )
        number_user=length-number_expert
        
        #depending of chat type different data should be fetched from db
        chat_type=kwargs.get('chat_type','all')
        if chat_type=='all':
            no_entries=length
        elif chat_type=='expert':
            no_entries=number_expert
        else:
            no_entries=number_user
        
        no_pages=no_entries/limit
        if (no_entries%limit)!=0:
                no_pages+=1
        no_pages=int(no_pages)
        current_page=int(kwargs.get('current_page',1))
        if chat_type=='all':
            sessions = ChatSession.select(and_(or_(ChatSession.c.expert_id == user_id,
                                            ChatSession.c.user_id == user_id),
                                            or_(
                                                ChatSession.c.status == "FINISHED",
                                                ChatSession.c.status == "RATED"
                                            )),
                                            limit=limit, offset=(current_page-1)*limit,
                                            order_by=desc(ChatSession.c.created))
        elif chat_type=='expert':
            sessions = ChatSession.select(and_(ChatSession.c.expert_id == user_id,
                                            or_(
                                                ChatSession.c.status == "FINISHED",
                                                ChatSession.c.status == "RATED"
                                            )),
                                            limit=limit, offset=(current_page-1)*limit,
                                            order_by=desc(ChatSession.c.created))
        else:
            sessions = ChatSession.select(and_(ChatSession.c.user_id == user_id,
                                            or_(
                                                ChatSession.c.status == "FINISHED",
                                                ChatSession.c.status == "RATED"
                                            )),
                                            limit=limit, offset=(current_page-1)*limit,
                                            order_by=desc(ChatSession.c.created))

        queryentries = []
        for sess in sessions:
           query = session.query(Query).get_by(query_id=sess.query_id)
           is_user= True;
           
           if sess.expert_id == user_id:
               is_user = False;
               
           if is_user:
               partner_id = sess.expert_id 
               topic = query.getTopicString(True)
           else:
               partner_id = sess.user_id
               topic = query.getTopicString(False)
               
           queryentries.append(
               {
                "created": helpers.formatDate(sess.created),
                "topic": topic,
                "text": query.text,
                "query_id": sess.query_id,
                "rating": sess.rating,
                "is_user": is_user,
                "categories": query.getCategoriesString(),
                "partner": session.query(User).get_by(user_id = partner_id).display_name,
                "isDirect":query.isDirect
              }
           )

        return dict(queryentries = queryentries, 
                    length = length, 
                    number_u = number_user, 
                    number_e = number_expert, 
                    no_pages=no_pages, 
                    current_page=current_page, 
                    chat_type=chat_type)   