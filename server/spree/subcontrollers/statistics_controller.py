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

import turbogears, cPickle

from turbogears import controllers, expose
from turbogears import identity, config, validate, error_handler

from turbogears.database import metadata, session

from sqlalchemy import *
from genshi.core import Markup

from spree.model import User, UserStats, getHighscoreList
from spree.spree_model import ChatSession, QueryExpert, Query
import spree.constants as constants

from spree import constants
from spree.util import helpers

'''
    Controller for the statistics box
'''


class StatisticsController(controllers.Controller, identity.SecureResource):
    '''
        Handles statistical contents.
    '''
        
    #require = identity.not_anonymous();    
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.im_userDetails")
    def getUserDetailsIM(self, user_id, *args, **kwargs):
        '''
            Fetches details for a selected user in the Instant Massinger tab
            
            @param user_id: identifies the user
            @return: values needed for the template
        '''
        return self.getUserDetailsSub(int(user_id))
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.boxes.userDetailsTooltip")
    def getUserDetailsForTooltip(self, user_id, *args, **kwargs):
        '''
            Fetches details for a selected user for the tool tip.
            
            @param user_id: identifies the user
            @return: values needed for the template
        '''
        
        return self.getUserDetailsSub(int(user_id))
     
    def getUserDetailsSub(self, user_id):
        '''
            Serves user details. 
            
            @param user_id: identifies the user
            @return: needed information about the user 
        '''
        
        limit=constants.max_openQueries
        user = User.get_by(User.c.user_id == int(user_id))
        
        if not user:
            return dict(name="", status="", rank="", score="", answers="", expertise="")
            
        myID = identity.current.user.user_id
        
        stats = user.user_stats

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
                                            Query.c.user_id == myID,
                                            Query.c.status != 'FINISHED'                                                        
                                        )
        )
        
        unratedQueryCount = session.query(ChatSession).count(
                                 and_(
                                      ChatSession.c.user_id == myID,
                                      ChatSession.c.rating == 0,
                                      ChatSession.c.status == "FINISHED"
                                  )                                                             
                             )
        
        #print openQueryCount, unratedQueryCount
        
        isFull = True
        #show warning when to many queries are still open
        if not openQueryCount + unratedQueryCount >= limit:
            isFull = False
        
        return dict(id=user.user_id, 
                    name=user.display_name[:30], 
                    status=status, 
                    rank=rank, 
                    score=stats.score, 
                    answers= stats.no_of_ques_answered,
                    asked = stats.no_of_ques_asked,
                    blogs = stats.no_of_blogs,
                    avg_rating_chat = round(stats.average_rating,2),
                    avg_rating_blogs = round(stats.average_blog_rating,2),
                    no_of_blog_ratings = stats.no_of_blog_ratings,
                    no_of_chat_ratings = stats.no_of_ques_answered_rated,
                    expertise=Markup(expertise),
                    isFull = isFull)
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.boxes.highscoreList")
    def getHighscoreList(self, *args, **kwargs):
        '''
            @return: list of high scored users (current user position is also shown)
        '''
        user = identity.current.user
        myID = user.user_id        
        myRank = user.getRank()
        
        bests = [[i.user_id, i.score] for i in select([UserStats.c.user_id, UserStats.c.score], order_by=[UserStats.table.c.rank], limit = 5).execute()]
        
        if myRank > constants.most_active_n_of_ranks:
            n_best = 3
        else:
            n_best = constants.most_active_n_of_ranks
        
        mostActives = []
        for i in range(0,n_best):
            if bests[i][0] == user.user_id:
                username = session.query(User).get_by(User.c.user_id==bests[i][0]).user_name
            else:
                username = session.query(User).get_by(User.c.user_id==bests[i][0]).display_name
                
            mostActives.append(
                {
                 'showRow': True,
                 'rank':i+1,
                 'user_name': username,
                 'user_id':  bests[i][0],
                 'score': bests[i][1],
                 'isMe':  bests[i][0] == user.user_id                 
                 }
            )
            
        if n_best < constants.most_active_n_of_ranks:
            mostActives.append({'showRow':False})
            mostActives.append(
                {
                 'showRow': True,
                 'rank':myRank,
                 'user_name': user.user_name,
                 'user_id': user.user_id,
                 'score': user.user_stats.score,
                 'isMe': True                
                }
            )
            
        return dict(rows = mostActives)
    
    @expose(content_type="json")
    def getTagStatistics(self, *args, **kwargs):
        from spree.submodels import tree_model
        
        queries = session.query(Query).select(not_(Query.c.isDirect))
        
        result = {}
        
        for q in queries:
            q.profile_subtree.encode('latin1')
            if q.profile_subtree == None or q.profile_subtree == "":
                continue
            try:
                tags = cPickle.loads(q.profile_subtree.encode('latin1'))
            except:
                continue
            
            for t in tags:
                if t in result:
                    result[t] += 1
                else:
                    result[t] = 1
                    
        tree = tree_model.getTree()
        
        tree_dict = toDict(tree.root)
        addNodeWeights(tree_dict, result)
                    
        return dict(tags=tree_dict)
    
    @expose(content_type="xml", html="spree.templates.statistics.alltags")
    def getTagStatisticsXML(self, *args, **kwargs):
        '''
            a tag statistic as xml
        '''        
        from spree.submodels import tree_model
        
        queries = session.query(Query).select(not_(Query.c.isDirect))
        
        result = {}
        
        for q in queries:
            if q.profile_subtree == None or q.profile_subtree == "":
                continue
            tags = cPickle.loads(q.profile_subtree.encode('latin1'))
            
            for t in tags:
                if t in result:
                    result[t] += 1
                else:
                    result[t] = 1
                    
        tree = tree_model.getTree()
        
        tree_dict = toDict(tree.root)
        addNodeWeights(tree_dict, result)
        
        return dict(xml=Markup(toXML(tree_dict)))

template_branch = '<branch name="%s" value="%d">\n%s\n</branch>\n'
template_leaf = '<leaf name="%s" value="%d"/>\n'

def toXML(node):
    '''
        convert a node and all its children to xml
        
        @param node: the node
        @return: the xml representation as string 
    '''
    branch = ""
    if 'children' in node:
        for c in node['children']:
            if 'children' in c:
                branch += template_branch % (c['title'],c['weight'],toXML(c))
            else:
                branch += template_leaf % (c['title'],c['weight'])
            
    return branch
    
def toDict(node):
    '''
        Converts a node and its children to a dict object.
        
        @param node: starting position for conversion 
        @return: dictionary filed with information about nodes from the subtree
    '''    
    res ={"title": node.name}
    res["nodeId"] = node.node_id
    if len(node.children) > 0:
        children = []
        node.children.sort(cmpNodes)
        res["isFolder"] = True
        for child in node.children:
            children.append(toDict(child))          
        res["children"] = children
    return res

def addNodeWeights(node, weights):
    '''
        gives a weight to a node and all its children
        
        @param node: the node
        @param weights: a dictionary of nodeIds->Weights   
    '''
    if node['nodeId'] in weights:
        node['weight'] = weights[node['nodeId']]
    else:
        node['weight'] = 0
        
    if 'children' in node:
        for c in node['children']:
            addNodeWeights(c, weights)
            
def cmpNodes(node1, node2):
    '''
        Compares two nodes by their name
        
        @param node1: first node
        @param node2: second node
        @return: 0 if true, -1 if false  
    '''
    return cmp(node1.name, node2.name)