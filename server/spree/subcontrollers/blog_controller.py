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
    The controller for the chat content box
'''
import turbogears
import string, cPickle
 
from turbogears import controllers, expose
from turbogears import identity, config, validate, error_handler

from sqlalchemy import *
from turbogears.database import session

from spree import register_model
from spree import json
import datetime
from operator import mod, truediv

from spree.model import User
from spree.spree_model import BlogEntry, UserBlog, Query, user_blog, ChatSession, ChatMessage, Settings
import spree.spree_model as model
from spree.submodels import tree_model
import spree.constants as constants
from spree.util import helpers


class BlogController(controllers.Controller, identity.SecureResource):
    '''
        Does all the necessary handling of the note entries. 
    '''
    
    require = identity.not_anonymous();
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.blog")    
    def getBlogsContent(self, query_id, *args, **kwargs):
        '''
            Fetches all notes of a current user. Takes care of paginate, too.
            Does something else, but don't know what!!! 
            
            @param query_id: identifies the query 
            @param *kwargs: contains current_page, needed for paginate.
            @return: values needed for the template
        '''
        blogentries = []
        for_relevant = False
        back_to_chat = False        
        query_id = int(query_id)
        limit=constants.n_of_blogs_per_page

        #calculation needed for paginate
        if int(query_id) <= 0:
            no_entries = session.query(BlogEntry).count_by(BlogEntry.c.user_id == identity.current.user.user_id);
            no_pages=truediv(no_entries, limit)
            if mod(no_entries, limit)!=0:
                no_pages+=1
            no_pages=int(no_pages)
                
            current_page=int(kwargs.get('current_page',1))
            entries = session.query(BlogEntry).select(BlogEntry.c.user_id == identity.current.user.user_id, limit=limit, offset=(current_page-1)*limit, order_by=desc(BlogEntry.c.created ));

            for entry in entries:
                private_string = "public"
                if entry.private:
                    private_string = "private"
                
                wlist=string.split(entry.text)
                w1=""
                for i in range(len(wlist)):
                    if len(w1)>100:
                        w1=w1+ '...'
                        break
                    else:
                        w1=w1+ wlist[i]+' '
                
                strCats = entry.getCategoriesString()
                #listCats = str(strCats).split(',') 
                strCatsIDs = str(tuple([int(entry.blogentry_id),str(entry.title)] + [int(a) for a in entry.getCategoriesIDs()] ))
                
                blogentries.append({"text": w1,
                                "topic": entry.title,
                                "id": entry.blogentry_id,
                                "created": helpers.formatDate(entry.created),
                                "last_changed": entry.lastChanged,
                                "for_relevant": for_relevant,
                                "private": private_string,
                                "categories": strCats,
                                "categoryIDs": strCatsIDs,
                                "user_id": entry.user_id,
                                "user": session.query(User).get_by(user_id=entry.user_id).user_name})
        
        # At the moment there isn't any link for relevant blogs in chat content.    
        else: 
            query = session.query(Query).get_by(query_id=int(query_id))
            for_relevant = True        
            back_to_chat= True
            relevant_blogs = query.relatedBlogs
            
            for entry in relevant_blogs:
                
                strCats = entry.getCategoriesString()
                #listCats = str(strCats).split(',') 
                strCatsIDs = str(tuple([int(entry.blogentry_id),str(entry.title)] + [int(a) for a in entry.getCategoriesIDs()] ))
                
                blogentries.append({"topic": entry.title,
                    "id": entry.blogentry_id,
                    "created": helpers.formatDate(entry.created),
                    "created4sort": entry.created,
                    "for_relevant": for_relevant,
                    "last_changed": entry.lastChanged,
                    "categories": entry.getCategoriesString(),
                    "categoryIDs": strCatsIDs,
                    "user": session.query(User).get_by(user_id = entry.user_id).display_name})
                
            blogentries.sort(lambda x,y: cmp(y['created4sort'], x['created4sort']))
        
        return dict(blogentries = blogentries,back_to_chat = back_to_chat,query_id = query_id, no_pages=no_pages, current_page=current_page)
               
    @expose(format="json")
    def updateBlogCategories(self,blogentry_id, **kwargs):
        '''
            Updates note category.
            
            @param blogentry_id: needed to identify note
            @param **kwargs: contains catIDs  ?
        '''
        entry = session.query(BlogEntry).get_by(blogentry_id=int(blogentry_id))
        if 'catIDs' in kwargs:     
            catIDs = kwargs['catIDs']
            if catIDs == 'unknown':
                entry.profile_subtree=cPickle.dumps([])
            elif isinstance(catIDs,unicode):
                entry.profile_subtree=cPickle.dumps([int(catIDs)])
            else:
                ids = map(int,catIDs)
                entry.profile_subtree=cPickle.dumps(ids)
        else:
            entry.profile_subtree=cPickle.dumps([])
        
        session.flush()
        return dict()
        
    
    @expose(format="json")
    def deleteBlogEntry(self, blogentry_id, **kwargs): 
        '''
            Deletes note and it's count.
            
            @param blogentry_id: needed to identify note
        '''
        
        entry = session.query(BlogEntry).get_by(blogentry_id=int(blogentry_id))
        entry.relatedQueries = []
        user=session.query(User).get_by(user_id = entry.user_id)

        if user.user_stats.no_of_blogs>1:
            user.user_stats.no_of_blogs-=1

        session.delete(entry);
        session.flush()
        return dict()
    
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.blogentry")
    def getBlogEntryContent(self, blogentry_id, for_query, query_id, *args, **kwargs):
        '''
            Fetches complete content of the note.
            
            @param blogentry_id: needed to identify note
            @param for_query: if the note was created from the query the relation exists
            @param query_id: ?
            @return: values needed for the template
        '''
        
        entry = session.query(BlogEntry).get_by(blogentry_id=int(blogentry_id))
        
        if not entry:
           return {"failure":True,
                   "for_query": for_query,
                   "query_id": query_id}

        wasRatedByUser = False
        ratings = session.query(UserBlog).select(
                   and_(
                        UserBlog.c.user_id == identity.current.user.user_id,
                        UserBlog.c.blogentry_id == int(blogentry_id)
                    )
                   )
               
        if ratings:
           wasRatedByUser = True        
                
        return {"failure":False,
                "text": entry.text,
                "topic": entry.title,
                "for_query": for_query,
                "query_id": query_id,
                "id": entry.blogentry_id,
                "created": helpers.formatDate(entry.created),
                "last_changed": entry.lastChanged,
                "user_id": entry.user_id,
                "average_rating": round(entry.average_rating, 2),
                "no_ratings": entry.no_ratings,
                "wasRatedByUser": wasRatedByUser,
                "isMine": entry.user_id == identity.current.user.user_id,
                "private": entry.private,
                "user": session.query(User).get_by(user_id=entry.user_id).display_name,
                "categories":entry.getCategoriesString(),
                "categoriesIDs":str(tuple([int(entry.blogentry_id),str(entry.title)]+[int(a) for a in entry.getCategoriesIDs()]))}
            
    
    # This function accepts a new blog entry.
    @expose(format="json")
    def do_BlogPost(self, *args, **kwargs):
        '''
            Creates new note entry.
            
            @param **kwargs: contains blogentry_id,text and title of the note,
                and information weather the note is private
        '''
        id = int(kwargs['blogentry_id']);
        private = kwargs['private'] == "true";
        
        query_id = None
        if 'query_id' in kwargs and kwargs['query_id'] > -1:
            query_id = int(kwargs['query_id']);

        text=kwargs['text'][:16250]
        title=kwargs['title'][:50]
        
        if id < 0:

            b = BlogEntry();
            b.title = title
            b.text = text;
            b.private = private;
            b.user_id = identity.current.user.user_id;
            subtree = self.getBlogSubtree("",b.text+" "+b.title)
            b.profile_subtree=cPickle.dumps(subtree)
            
            if query_id:
                b.query_id = query_id
                
            user=session.query(User).get_by(user_id = b.user_id)

            user.user_stats.no_of_blogs+=1
            
        else:
            b = session.query(BlogEntry).get_by(blogentry_id=id)
            b.title = title
            b.text = text
            b.private = private;
            subtree = self.getBlogSubtree("",b.text+" "+b.title)
            b.profile_subtree=cPickle.dumps(subtree)
            if query_id:
                b.query_id = query_id
            
        session.save(b);
        session.flush();
            
        return dict()
        

    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.blogedit")
    def getBlogEditContent(self, blogentry_id, query_id='', query_topic='', *args, **kwargs):
        '''
            Enables user to edit note entries. Used in three cases: when note is created from a chat,
            when new note is created from scratch and when note is edited.
            
            @param blogentry_id: identifies the note
            @param query_id: needed when note is made from chat (links it to query)
            @param query_topic: needed when note is made from chat (takes the query topic)
            @return: values needed for the template
        '''
        
        back_chat= "";
        
        # Expert creates a note entry from chat
        if(int(blogentry_id) == -2):
            query = session.query(Query).get_by(Query.c.query_id==int(query_id))
            cs = session.query(ChatSession).select(ChatSession.c.query_id==int(query_id))[0]
            chat_massages = session.query(ChatMessage).select(and_(ChatMessage.c.session_id==cs.session_id, ChatMessage.c.type == "POSTED"), order_by=ChatMessage.c.created);
           
            return {"private": "false",
                    "text": "",
                    "chat_text": [message.text + "\n" for message in chat_massages],
                    "back_chat": True,
                    "topic": query.topic,
                    "query_id": query_id,
                    "blogentry_id": -1}
        
        # Create new entry        
        elif(int(blogentry_id) == -1):
            return {"private": "false",
                    "text": "",
                    "back_chat": False,
                    "topic": "",
                    "query_id": query_id,
                    "blogentry_id": -1}
            
        # Edit entry   
        entry = session.query(BlogEntry).get_by(blogentry_id=int(blogentry_id))
        return {"privat":entry.private,
                "text": entry.text,
                "topic": entry.title,
                "back_chat": False,
                "query_id": query_id,
                "blogentry_id": entry.blogentry_id}
        
    
    def getBlogSubtree(self, topic, text):
        '''
            Classifies the note, according to it's text.
            
            @param topic: should be used
            @param text: needed for classification
            @todo: add topic to text when classifying
            @return: subtree that holds note classification results
        '''
        
        return tree_model.getSubtreeForText(text,1.0)

    @expose(format="json")
    def doBlogRating(self, blogentry_id, rate, *args, **kwargs): 
        '''
            Calculates blog rating. Updates note's score, score of the user who created 
            it and keeps track of who rated which note (this way user can rate note only once).
            
            @param blogentry_id: identifies note
            @param rate:  points given
        '''

        #update the blogentry table
        entry = session.query(BlogEntry).get_by(blogentry_id=int(blogentry_id))
        if not entry:
            return dict()
        
        new_value=round(entry.average_rating*entry.no_ratings)
        #print 'old blog score', new_value,'old average',entry.average_rating
        entry.no_ratings+=1
        entry.average_rating=(new_value+float(rate))/entry.no_ratings
       
        #print 'rate', rate,'new average', entry.average_rating

        session.flush()
        
        #updates the user_blog table

        new_rate=UserBlog()
        new_rate.user_id = identity.current.user.user_id
        new_rate.blogentry_id = blogentry_id
        new_rate.rating = rate
        new_rate.created = datetime.datetime.now()

        session.save(new_rate)
        session.flush()
        
        #updates the user_stats table
        
        user=session.query(User).get_by(user_id = entry.user_id)
        user.user_stats.no_of_blog_ratings+=1
        #print 'old averege blog rating',user.user_stats.average_blog_rating
        
        user_blogs=session.query(BlogEntry).select(BlogEntry.c.user_id==entry.user_id) #[BlogEntry.c.average_rating, BlogEntry.c.no_ratings]
        sum=0.0
        no_blogs=0
        for ub in user_blogs:
            sum+=ub.average_rating*ub.no_ratings
            no_blogs+=ub.no_ratings
        sum=round(sum)/no_blogs
        #print 'new average blog rating',sum
        user.user_stats.average_blog_rating=sum

        #print 'old score',user.user_stats.score
        #print 'new values', user.user_stats.no_of_ques_answered_rated * user.user_stats.average_rating, user.user_stats.no_of_blog_ratings * user.user_stats.average_blog_rating
        user.user_stats.score=round(user.user_stats.no_of_ques_answered_rated * user.user_stats.average_rating + user.user_stats.no_of_blog_ratings * user.user_stats.average_blog_rating)
        #print 'new score',user.user_stats.score
          
        session.flush()
        return dict() 