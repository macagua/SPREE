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
    Table object wrappers needed by spree and methods provided by these object.
'''


import turbogears
import cPickle, pkg_resources
from sqlalchemy import *

from sqlalchemy.ext.activemapper import ActiveMapper, column, one_to_many, one_to_one, many_to_many

from turbogears.database import metadata, session
import sqlalchemy.databases.mysql as mysql
from datetime import datetime
from turbogears import config

from spree import model
import constants

from spree.util import mail
from util.matching import distances

# for automatic table creation only..
def create_spree_tables():
    '''
        Creates the appropriate database tables.
    '''
    
    Query.table.create(checkfirst=True)
    ChatSession.table.create(checkfirst=True)
    ChatMessage.table.create(checkfirst=True)
    BlogEntry.table.create(checkfirst=True)
    query_expert_table.create(checkfirst=True)
    query_blogentry_table.create(checkfirst=True)
    user_blog.create(checkfirst=True)
    Feedback.table.create(checkfirst=True)
    FeedbackInt.table.create(checkfirst=True)
    Settings.table.create(checkfirst=True)

# Automatically create tables when TurboGears starts up
turbogears.startup.call_on_startup.append(create_spree_tables)

# a many-to-many table connecting experts identified by the system to questions
query_expert_table = Table("query_expert", metadata,
                     Column("query_id", Integer, ForeignKey("query.query_id"), primary_key=True),
                     Column("expert_id", Integer, ForeignKey("tg_user.user_id"), primary_key=True),
                     #Column("rating", Float, default = 1.0),
                     Column("status", String(50), default="HANDSHAKE")
)

# a many-to-many table connecting blogs identified by the system to questions
query_blogentry_table = Table("query_blogentry", metadata,
                     Column("query_id", Integer, ForeignKey("query.query_id"), primary_key=True),
                     Column("blogentry_id", Integer, ForeignKey("blogentry.blogentry_id"), primary_key=True),
                     #Column("rating", Float, default = 1.0),
                     Column("score", Float, default = 1.0)
)

# a many-to-many table connecting users to other user's blogs when they rated a blog
user_blog = Table("user_blog", metadata,
                      Column("user_id", Integer,ForeignKey("tg_user.user_id"), primary_key=True),
                      Column("blogentry_id", Integer,ForeignKey("blogentry.blogentry_id"), primary_key=True),
                      Column("rating",Integer,default=0),
                      Column ("created",DateTime, default=datetime.now)
)

class Query(ActiveMapper):
    '''
        Holds necessary information about queries posted by the users.
        
        @todo: Add indices (isDirect, status!, created!)
    '''
    
    class mapping:
        query_id = column(Integer, primary_key=True)
        user_id = column(Integer, foreign_key="tg_user.user_id", index=True)
        created = column(DateTime, default=datetime.now)
        topic = column(String(250)) # the topic of a query
        text = column(TEXT(40000)) # the query' text
        status = column(String(50)) # the status of a query ['OPEN','HANDSHAKE','CHAT','FINISHED','RATED']
        isDirect = column(Integer(1),default=0) # true if the question was asked directly to an expert
        profile = column(mysql.MSText, default= "") # the questions profile as specified by the user
        profile_subtree = column(mysql.MSText, default= "") # the questions profile as specified by the user as subtree (parent nodes added)
        profile_calculated_subtree = column(mysql.MSText, default= "") # the questions profile as calculated by the system

        experts = many_to_many("User", query_expert_table, backref="queries") # the experts contacted with that question
        relatedBlogs = many_to_many("BlogEntry", query_blogentry_table, backref="relatedQueries") # the blogs which the system identifies as related to this question
        
        user = one_to_one("User", lazy=True)
        chatSession = one_to_one("ChatSession", backref="query", lazy=True)
    
    def getSimilarity(self, subgraph):
        '''
            Computes similarity between query and the given subgraph
            
            @param subgraph: a second subgraph used in comparison process.
            @return: The graph overlap measure to another graph.
        '''
        
        return distances.getOverlapBetweenGraphs(subgraph, self.profile)
        
    def findExperts(self,dont_ask=0, n_max_experts = constants.n_max_experts):
        '''
            Identifies and adds the experts to this query which could answered the question.
            
            @param dont_ask: carries the user_id of the user who had already asnwered the question 
                    (so he is left out if the question is asked again).
            @param n_max_experts: defines how many top experts should be fetched.
        '''
        
        self.experts = []
        users = model.User.select()
        
        scores = []
        res_users = []

        for user in users:
            if user.user_id != self.user_id:
                scores.append(user.getRelativeExpertise(cPickle.loads(self.profile_subtree)))
                res_users.append(user)
            
        rated_users=zip(scores,res_users)
        rated_users=filter(lambda x: x[0] > 0,rated_users)
        rated_users.sort()
        rated_users.reverse()
        
        #take out the expert who was already conntacted for this question
        if dont_ask!=0:
            rated_users = filter(lambda x: x[1].user_id != dont_ask, rated_users)

        #take out overloaded experts (>=5 incoming questions)
        i=0
        temp = []
        for user in rated_users:
            overload=session.query(QueryExpert).count_by(and_(QueryExpert.c.expert_id == user[1].user_id,QueryExpert.c.status=='HANDSHAKE'));
            overload+=session.query(ChatSession).count_by(and_(ChatSession.c.expert_id == user[1].user_id,or_(ChatSession.c.status=='ONGOING', ChatSession.c.status=='HANDSHAKE')));
            if overload<5:
                temp.append(user)
            if len(temp) == n_max_experts:
                break 

        rated_users = temp
        for user in rated_users:
            self.experts.append(user[1])                
        
    def findRelatedBlogs(self, n_max_blogs = constants.n_max_blogs):
        '''
            Identifies and adds the related blogs to the query based on the query's profile.
            
            @param n_max_blogs: defines the number of top matching blogs that should be fetched.
        '''
        
        self.relatedBlogs = []
        
        blogs = BlogEntry.select()
        
        #print blogs
        
        scores = []
        res_blogs = []
        
        for blog in blogs:
            if blog.user_id != self.user_id and not blog.private:
                #print blog.user_id, self.user_id
                scores.append(blog.getSimilarity(cPickle.loads(self.profile_subtree)))
                res_blogs.append(blog)
            
        rated_blogs=zip(scores,res_blogs)
        rated_blogs.sort()
        rated_blogs.reverse()
        
        rated_blogs = rated_blogs[:n_max_blogs-1]
        
        for blog in rated_blogs:
            if blog[0] > 0.0:
                self.relatedBlogs.append(blog[1])
                
    def getCategoriesString(self):
        '''
            @return: All categories of the query as string.
        '''
        
        from spree.submodels.tree_model import getNodeNames
        categories = ""
        
        for topic in getNodeNames(cPickle.loads(self.profile.encode('latin1'))):
            categories += topic + ", "
        
        if len(categories) > 0:
            categories = categories[:-2]
        else:
            categories = "unknown"
            
        return categories
    
    def getTopicString(self, out = True, maxlength=1000):
        '''
            Returns the queries topic string.
            The string varies if the query goes directly to a certain user.
            
            @param out: true if it is outgoing query
            @param maxLength: max length of the topic string  
        '''
             
        from spree.model import User
        
        topic = ""
        
        if self.isDirect == 1:
            if out:
                from spree.spree_model import QueryExpert
                try:
                    expert_id = session.query(QueryExpert).select(
                                     self.query_id == QueryExpert.c.query_id, 
                                     limit=1)[0]
                    expert = session.query(User).get_by(User.c.user_id == expert_id.expert_id)
                    
                    topic = "%s (direct to %s)" % (self.topic, expert.display_name)
                except:
                    topic = "%s (direct)" % (self.topic)
            else:
                if self.status in ["OPEN","HANDSHAKE"]:
                    user = session.query(User).get_by(User.c.user_id == self.user_id)
                    topic = self.topic + (" (direct from %s)" % user.display_name)                    
                else:
                    topic = "%s (direct)" % (self.topic)
        else:
            topic = self.topic
            
        if self.topic == "":
            topic = "(No Subject) %s" % topic 
            
        return topic[:maxlength]
    
    def informExperts(self, *args):
        '''
            Fills a template of a mail which will be sent to the expert.
            
            @parem *args: args[0] contains server address.  
        '''
        
        import thread
        serverAddress = args[0]
        
        for e in self.experts:
            if e.getSettings().email == 1:
                body = pkg_resources.resource_string(__name__, 
                            'templates/send_question_to_expert_email.txt')                
                body = body % {"expertname":e.user_name,
                               "username":self.user.display_name,
                               "question":self.text,
                               "address":serverAddress}
                subject = "SPREE - Incoming Question: %s" % self.getTopicString()                
                to_address = e.email_address                
                
                #mail.send_email(to_address, subject, body)
                thread.start_new_thread(mail.send_email,(to_address, subject, body))
        return
    
class QueryExpert(object):
    '''
        A relationship between asked query and experts that could answer it.
    '''
    
    pass

mapper(QueryExpert, query_expert_table,
       primary_key=[query_expert_table.c.query_id, query_expert_table.c.expert_id],
       properties={
            'query' : relation(Query, lazy=False), 
            'expert' : relation(model.User, lazy=False) 
       }
)
                
###########################################################################
# Feedback
###########################################################################

   
#All feedbacks are collected here        
class Feedback(ActiveMapper):
    '''
        Hold information about user entered feedback
    '''
    
    class mapping:
        feedback_id = column(Integer, primary_key=True)
        user_id = column(Integer, foreign_key = "tg_user.user_id")
        created = column(DateTime, default=datetime.now)
        design = column(TEXT(10000))
        interaction = column(TEXT(10000))
        bugs = column(TEXT(10000))
        ideas = column(TEXT(10000))
        
#All feedbacks are be collected here        
class FeedbackInt(ActiveMapper):
    '''
        Holds information about users feeback form selections
    '''
    
    class mapping:
        feedback_int_id = column(Integer, primary_key=True)
        user_id = column(Integer, foreign_key = "tg_user.user_id")
        created = column(DateTime, default=datetime.now)
        fast_registration = column(Integer, default=0)
        ask_many_steps = column(Integer, default=0)
        change_automatic_classification = column(Integer, default=0)
        easy_categorization = column(Integer, default=0)
        right_categorization = column(Integer, default=0)
        competent_expert = column(Integer, default=0)
        see_answer = column(Integer, default=0)
        see_question = column(Integer, default=0)
        quick_answer = column(Integer, default=0)
        helpful_answer = column(Integer, default=0)
        expert_online = column(Integer, default=0)
        no_system_errors = column(Integer, default=0)
        system_speed = column(Integer, default=0)
        everyday = column(Integer, default=0)
        clear_design = column(Integer, default=0)
        predictable_reaction = column(Integer, default=0)
        how_to_use = column(Integer, default=0)		

###########################################################################
# Chat
###########################################################################

class ChatMessage(ActiveMapper):
    '''
        During the chat users are entering chat messages.
    '''
    class mapping:
        chat_message_id = column(Integer, primary_key=True)
        session_id = column(Integer, foreign_key = "chatsession.session_id")
        user_id = column(Integer, foreign_key = "tg_user.user_id")
        created = column(DateTime, default=datetime.now)
        type = column(String(50))
        text = column(TEXT(10000))
        
# chat related tables
class ChatSession(ActiveMapper):
    '''
        A chat session is created when an expert accepts a question, and it consists of a list of chat messages.
    
        @todo: add indices (status, created, rating?)
    '''
    class mapping:
        session_id = column(Integer, primary_key=True)
        query_id = column(Integer, foreign_key = "query.query_id", unique = True)
        user_id = column(Integer, foreign_key = "tg_user.user_id")
        expert_id = column(Integer, foreign_key = "tg_user.user_id")
        created = column(DateTime, default=datetime.now)
        status = column(String(50))
        rating = column(Integer,default=0)
        #rating_comment = column(TEXT(2000))
        #rating_created = column(DateTime)
        #rating_comment_last_edited = column(DateTime)
        
        messages = one_to_many("ChatMessage", backref="chatSession", order_by=asc(ChatMessage.c.created), lazy=True)
        
    def getLastMessage(self):
        '''
            @return: last message for a given chat session
        '''
        messages = self.messages
        if len(messages) == 0:
            return None
        
        return self.messages[-1]
    
    def getUser(self):
        '''
            @return: user object of the user who is chatting
        '''
        
        from spree.model import User
        return session.query(User).get_by(User.c.user_id == self.user_id)
     
    def getExpert(self):
        '''
            @return: user object of the expert who is chatting
        '''
        
        from spree.model import User
        return session.query(User).get_by(User.c.user_id == self.expert_id)

###########################################################################
# Notebook
###########################################################################
    
class BlogEntry(ActiveMapper):
    '''
        A notebook entry.
        
        @todo: add indices
    '''
    
    class mapping:
        blogentry_id = column(Integer, primary_key=True)
        user_id = column(Integer, foreign_key = "tg_user.user_id")
        query_id = column(Integer, foreign_key = "query.query_id")
        title = column(TEXT(1000)) # the blogs title
        text = column(TEXT(20000)) # the blog text
        created = column(DateTime, default=datetime.now)
        lastChanged = column(DateTime, default=datetime.now)
        private = column(Integer, default=0) # if true this blog is not shown to other users
        profile = column(mysql.MSText, default= "") # the category profile of this blog as specified by the user
        profile_subtree = column(mysql.MSText, default= "")  # the category profile of this blog as specified by the user as subtree
        profile_calculated_subtree = column(mysql.MSText, default= "")  # the category profile of this blog as calculated by the system
        average_rating = column(Float, default=0.0) # the avg. rating for this blog
        no_ratings = column(Integer, default=0) # the number of ratings for this blog
        
        user = many_to_many("User", user_blog, backref="blogentry")
    
    ActiveMapper.mysql_engine='InnoDB'
    
    def getSimilarity(self, subgraph):
        '''
            Computes similarity between this blog and a given subgraph
            
            @param subgraph: a second subgraph used in comparison process.
            @return: The graph overlap measure to another graph.
        '''
        
        subtree=cPickle.loads(self.profile_subtree.encode('latin1'))
        return distances.getOverlapBetweenGraphs(subgraph, subtree)
        
    def getCategoriesString(self):
        '''
             @return: All categories of the note as string.
        '''
        
        from spree.submodels.tree_model import getNodeNames
        categories = ""
        
        for topic in getNodeNames(cPickle.loads(self.profile_subtree.encode('latin1'))):
            categories += topic + ", "
        
        if len(categories) > 0:
            categories = categories[:-2]
        else:
            categories = "unknown"
  
        return categories
    
    def getCategoriesIDs(self):
        '''
            @return: this blogs categories as list of node ids
        '''
        return cPickle.loads(self.profile_subtree.encode('latin1'))
    
class UserBlog(object):
    '''
        A relationship between users and the notes they have rated.
    '''
    
    pass

mapper(UserBlog, user_blog,
       primary_key=[user_blog.c.user_id, user_blog.c.blogentry_id],
       properties={
            'blog' : relation(BlogEntry, lazy=False),
            'user' : relation(model.User, lazy=False)
       }
)

###########################################################################
# Settings
###########################################################################

class Settings(ActiveMapper):
    '''
        User settings. 
    '''
    
    class mapping:
        id = column(Integer, primary_key=True)
        user_id = column(Integer, foreign_key="tg_user.user_id")
        anonymous = column(Integer, default = 0) # user wants to be anonymous (not used)
        email = column(Integer, default = 1) # user wants to be informed via email about incoming questions
        iFtype = column(Integer, default = 0) # the interface type a user has chosen
        newsletter = column(Integer, default = 1) # the user wants to get the spree newsletter
        created = column(DateTime, default=datetime.now)