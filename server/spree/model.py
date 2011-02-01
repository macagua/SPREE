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
    Provides a python representation of the database tables
'''
from datetime import datetime, timedelta
import cPickle

import sqlalchemy.databases.mysql as mysql
from sqlalchemy import *
from sqlalchemy.ext.activemapper import ActiveMapper, column, \
                                    one_to_many, one_to_one, many_to_many

from turbogears import identity 
from turbogears.database import metadata, session

from spree import constants
from spree.util.matching import distances

class Visit(ActiveMapper):
    '''
        Logs the user visits
    '''
    class mapping:
        __table__ = "visit"
        visit_key = column(String(40), primary_key=True)
        created = column(DateTime, nullable=False, default=datetime.now)
        expiry = column(DateTime)

    def lookup_visit(cls, visit_key):
        return Visit.get(visit_key)
    lookup_visit = classmethod(lookup_visit)

# tables for identity
user_group = Table("user_group", metadata, 
                      Column("user_id", Integer,
                              ForeignKey("tg_user.user_id"),
                              primary_key=True),
                      Column("group_id", Integer,
                              ForeignKey("tg_group.group_id"),
                              primary_key=True))

group_permission = Table("group_permission", metadata,
                            Column("group_id", Integer,
                                    ForeignKey("tg_group.group_id"),
                                    primary_key=True),
                            Column("permission_id", Integer,
                                    ForeignKey("permission.permission_id"),
                                    primary_key=True))

class VisitIdentity(ActiveMapper):
    '''
        Registers the user when he logs in.
    '''
    
    class mapping:
        __table__ = "visit_identity"
        visit_key = column(String(40), foreign_key="visit.visit_key",
                          primary_key=True)
        user_id = column(Integer, foreign_key="tg_user.user_id", index=True)


class Group(ActiveMapper):
    '''
        An ultra-simple group definition.
    '''
    
    class mapping:
        __table__ = "tg_group"
        group_id = column(Integer, primary_key=True)
        group_name = column(String(16), unique=True)
        display_name = column(String(255))
        created = column(DateTime, default=datetime.now)
  

class UserStats (ActiveMapper):
    '''
        Additional information about user, statistical information mostly.
        
        Some information is redundant in order to improve performance.
    '''
    
    class mapping:
        __table__="user_stats"
        user_stats_id = column(Integer, primary_key=True) 
        user_id = column(Integer, foreign_key="tg_user.user_id")
        no_of_ques_asked = column(Integer, default=0) # number of questions asked by this user
        no_of_ques_answered = column(Integer, default=0) # number of questions answered by this user
        no_of_ques_answered_rated = column(Integer, default=0) #number of answers with a rating 
        no_of_blogs = column(Integer, default=0) # number of blogs by this user
        no_of_blog_ratings = column(Integer, default=0) # number of ratings for this user's blogs
        average_blog_rating = column(Float, default=0.0) # avg. blog rating
        average_rating = column(Float, default=0.0) # avg. overall rating
        score = column (Integer, default=0) # resulting score
        isOnline = column (Integer(1), default=0) # user is online
        isOnlineLastUpdated = column(DateTime, default=datetime.now) # last time we checked whether user is currently online
        rank = column(Integer, default=0) # the user's rank
        rankLastUpdated = column(DateTime, default=datetime.now) # the last time we updated the users rank
        
class User(ActiveMapper):
    '''
        Reasonably basic User definition. Probably would want additional attributes.
    '''
    
    class mapping:
        __table__ = "tg_user"
        user_id = column(Integer, primary_key=True)
        user_name = column(String(16), unique=True)
        email_address = column(String(255), unique=True)
        display_name = column(String(255))
        password = column(String(40))
        created = column(DateTime, default=datetime.now)
        keywords_specified=column(mysql.MSText,default= "") # the keywords a user specified during registration
        websites_specified=column(mysql.MSText,default= "") # the websites a user specified during registration
        expertise = column(mysql.MSText, default= "") # a user's expertise (cPickle({'node_id':'expertise_level',...])
        expertise_subtree = column(mysql.MSText, default= "") # a user's expertise as subtree (cPickle({'node_id':'expertise_level',...])
        expertise_calculated_subtree = column(mysql.MSText, default= "") # a user's expertise as subtree as calculated by the matching algorithm 
                                                                         #(cPickle({'node_id':'expertise_level',...])

        groups = many_to_many("Group", user_group, backref="users") # the groups a user belongs to (unused)
        user_stats = one_to_one("UserStats", backref="user", lazy=True) # the user's statistics
        settings = one_to_one("Settings", backref="user", lazy=True) # the user's settings
   
    def permissions(self):
        '''
            Returns all permissions
        '''
        
        perms = set()
        for g in self.groups:
            perms = perms | set(g.permissions)
        return perms
    permissions = property(permissions)

    def getRelativeExpertise(self, subgraph):
        '''
            @return: A similarity value between a subtree and the users expertise subtree
        '''
    
        subtree=cPickle.loads(self.expertise_subtree.encode('latin1'))
        return distances.getOverlapBetweenGraphs(subgraph, subtree.keys())
    
    def getExpertiseAsText(self):
        '''
            For a given user shows all the categories in which he considers himself an expert. 
            
            @return: A list with the full path name (as it is represented in a tree hierarchy) for each category.
        '''
        
        from spree.submodels import tree_model
        nodes = cPickle.loads(self.expertise.encode('latin1'))
        
        tree = tree_model.getTree()
        
        nodenames = [tree.asDict[node_id].getFullPath() for node_id in nodes]
        
        return nodenames            

    def isOnline(self):
        '''
            @return: Boolean (true if user is online).
        '''
        user_stats = self.user_stats
        
        # reload if status is old
        if not user_stats.isOnlineLastUpdated or user_stats.isOnlineLastUpdated < datetime.now() - timedelta(seconds = constants.isOnlineExpire):
            t=[]
            visit=session.query(Visit).select(and_(VisitIdentity.c.visit_key == Visit.c.visit_key, self.user_id == VisitIdentity.c.user_id))
            isOnline = 0
            for v in visit:
                t.append(v.expiry)
            t.sort()
            t.reverse()
            if len(t) > 0 and datetime.now()<t[0]:
                isOnline = 1

            user_stats.isOnline = isOnline
            user_stats.isOnlineLastUpdated = datetime.now()
            
            session.save(user_stats)
            session.flush()
            
        return user_stats.isOnline == 1
    
    def getRank(self):
        '''
            @return: the experts rank based on his score
        '''
        user_stats = self.user_stats
        
        #reload if status is old
        if not user_stats.rankLastUpdated or user_stats.rankLastUpdated < datetime.now() - timedelta(seconds = constants.rankExpire):
            updateRanks()
            user_stats = self.user_stats
        
        return user_stats.rank
    
    def getSettings(self):
        '''
            A user's settings. If user settings are empty, settings are first created.
            
            @return: User settings.
        '''
        
        s = self.settings
        if s:
            return s
        else:
            from spree.spree_model import Settings
            self.settings = Settings()
            session.save(self)
            session.flush()
            return self.getSettings()
    
    def getIncomingLoad(self):
        '''
            @return: the number of questions in the users' inbox
        '''
        
        from spree.spree_model import QueryExpert, ChatSession
        
        load=session.query(QueryExpert).count_by(and_(QueryExpert.c.expert_id == self.user_id,QueryExpert.c.status=='HANDSHAKE'))
        load+=session.query(ChatSession).count_by(and_(ChatSession.c.expert_id == self.user_id,or_(ChatSession.c.status=='ONGOING', ChatSession.c.status=='HANDSHAKE')))
        return load

class Permission(ActiveMapper):
    '''
        Allows definition of permissions for user authorization
    '''

    class mapping:
        __table__ = "permission"
        permission_id = column(Integer, primary_key=True)
        permission_name = column(String(16), unique=True)
        description = column(String(255))

        groups = many_to_many("Group", group_permission,
                              backref="permissions")

def getNumberOfAllUsers():
    '''
        @return: number of all registrated users.
    '''
    
    users = session.query(User).count();
    return users;

def getUsersCurrentlyOnline():
    '''
        @return: all users currently online (ids)
    '''
    users = [user.user_id for user in User.table.select(and_(User.c.user_id == VisitIdentity.c.user_id, VisitIdentity.c.visit_key == Visit.c.visit_key, Visit.c.expiry > datetime.now())).execute()]
    return set(users)

def getNumberOfAllUsersCurrentlyOnline():
    '''
        @return: number of all users online.
    '''    
    return len(getUsersCurrentlyOnline())

def getHighscoreList():
    '''
        @return: A list of [user_score, user_id] elements, sorted by the user_score (desc).
    '''
    
    r = []
    user_scores=session.query(UserStats).select()
    for us in user_scores:
        r.append([us.score,us.user.user_id])
    r.sort()
    r.reverse()
    return r

def updateRanks():
    '''
        updates all user ranks based on each users score
    '''
    scores = getHighscoreList()
    
    stats = session.query(UserStats).select()
    
    user2rank = {}
    count = 1
    for s in scores:
        user2rank[s[1]] = count
        count += 1
    
    for s in stats:
        s.rank = user2rank[s.user_id]
        s.rankLastUpdated = datetime.now()
            
        session.save(s)
    
    session.flush()