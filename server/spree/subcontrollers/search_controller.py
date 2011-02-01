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
    Controller for the search (ASK) content
'''
import turbogears
import cPickle, threading, pkg_resources
from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler

from turbogears.database import metadata, session

from genshi.core import Markup

from sqlalchemy import *
from datetime import datetime, timedelta
from spree import register_model
from spree import json

from spree.model import User
from spree.spree_model import Query, ChatSession, BlogEntry, QueryExpert
from spree.submodels import tree_model
from spree.submodels.log_model import QueryLog
import spree.constants as constants
from spree.util import helpers

from spree.util.text import extractor

# the search content box controller

class SearchController(controllers.Controller, identity.SecureResource):
    '''
        Handels content box.
    '''
     
    limit=constants.max_openQueries   
    require = identity.not_anonymous();
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.search")
    def getSearchContent(self, *args, **kwargs):
        '''
            Takes the entered query and topic and tries to classify it. It also checks that the limit 
            of questions and open chats per user is not exceeded.
            
            @param **kwargs: contains query_id if the question is asked again
            @return: values needed for the template
        '''

        # if the question is asked for the first time it gets query_id=-1 otherwise it is read from the db
        if 'query_id' in kwargs:
            query_id = kwargs['query_id']
            query=session.query(Query).get_by(Query.c.query_id==query_id)
            text=query.text
            topic=query.topic
        else:
            text=''
            topic=''
            query_id=-1
        
        openQueryCount = session.query(Query).count(
                                                    and_(
                                                        Query.c.user_id == identity.current.user.user_id,
                                                        Query.c.status != 'FINISHED'                                                        
                                                    )
                         )
        
        unratedQueryCount = session.query(ChatSession).count(
                                 and_(
                                      ChatSession.c.user_id == identity.current.user.user_id,
                                      ChatSession.c.rating == 0,
                                      ChatSession.c.status == "FINISHED"
                                  )                                                             
                             )
        
        
        #show warning when to many queries are still open
        if not openQueryCount + unratedQueryCount < self.limit:
            raise redirect("/content/search/getSearchContentLimitReached")
        
        categories = []
        
        tree = tree_model.getTree()
        
        for node in tree.asDict.values():
            if node.name == 'root':
                categories.append([" Not enough data for classification", -1])
            else:
                categories.append([node.getFullPath(), node.node_id])
        
        categories.sort()
        
        return dict(categories = categories,text=text,topic=topic,query_id=query_id )
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.search_limitreached")
    def getSearchContentLimitReached(self, *args, **kwargs):
        '''
            Show warning when to many queries are still open.
        '''
        return dict(max_queries = self.limit)


    # accept a new query
    #
    # kwargs:
    #    query: the query string
    #    topic: the topic string
    @expose(format="json")
    def doQuery(self, *args, **kwargs):
        '''
            Accepts a new query, classifies it (automatic classification could be enough, 
            but manual interruption is allowed in this stage too) and saves it in a db. 
            Updates query logging. If expert settings demand it, email with the query is sent. 
            
            @param **kwargs: contains text, topic and categories of the query 
            @return: query_id
        '''
        
        text = kwargs['query'][:16250]
        topic = kwargs['topic'][:50]
        categories_set = kwargs['categories_set']
        
        try:
            # we got only one integer instead of a list
            nodes = tree_model.getNodesOnPath(int(categories_set))
            categories = [int(categories_set)]
        except:
            nodes = []
            for cat in categories_set:
                nodes.extend(tree_model.getNodesOnPath(int(cat)))
                
            categories = [int(cat) for cat in categories_set]
        
        categories_calculated = tree_model.getSubtreeForText(topic + " " + text, 1.5)
        
        q = Query(user_id = identity.current.user.user_id, 
                  text= text,
                  topic = topic,
                  status='OPEN')
        
        q.profile_calculated_subtree=cPickle.dumps(categories_calculated)
            
        q.profile_subtree = cPickle.dumps(list(set([node.node_id for node in nodes])))
        q.profile = cPickle.dumps(categories)

        user=session.query(User).get_by(user_id = identity.current.user.user_id)
        user.user_stats.no_of_ques_asked+=1
        
        query_log=QueryLog(
            user_id=identity.current.user.user_id,
            user_name=identity.current.user.user_name
            )
        

        #-1 means that the question is asked for the first time, not reposted
        query_id=kwargs.get('query_id',-1)
        if (int(query_id))!=-1:
            query_existing=session.query(Query).get_by(Query.c.query_id==query_id)
            expert_id=query_existing.chatSession.expert_id
            query_log.status='Asked again'
            q.findExperts(expert_id)
        else:
            query_log.status='New'
            q.findExperts()
        
        q.findRelatedBlogs()
        
        session.save(q)
        session.flush()
        query_log.query_id=q.query_id
        session.save(query_log)
        print 'ZZZZZZZZZZZZZZZZZZZ',query_log.query_id
        session.flush()
        # send emails to all experts (if wanted) in a different thread
        from spree.util.cherrypy import url
        baseUrl = url.getServerUrl()
        #threading.Thread(target=q.informExperts, args=[baseUrl]).start() 
        
        q.informExperts([baseUrl])
        
        return dict(query_id = q.query_id)
    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def getKeywordsAndCategories(self, *args, **kwargs):
        '''
            Extracts keywords from the query and does automatic classification.
            
            @param **kwargs: contains text and topic of the query
            @return: keywords extracted and information about classification
        '''
           
        text = kwargs['text']
        topic = kwargs['topic']
        
        bow = extractor.createDictionaryFromText(topic + " " + text)
        
        subtree = tree_model.getSubtreeForBow(bow, 1.5)
                
        rows = []
        for node in subtree:
            rows.append({'id':node.node_id, 
                         'distance': round(node.distance,5), 
                         'label':node.name,
                         'exp':0,
                         'fullpath':node.getFullPath(),
                         'branch':node.getBranch(),
                         'level':node.level})
        
        template = "<span onclick='javascript:search_classifyManually();' title='Modify' target='_blank' style='font-size:%dpx; color:#003C73;'>%s</span>&nbsp;&nbsp;\t"
        html =""
        rmax=0
        rmin=0

        if len(rows) == 0:
            return dict(keywords= [], rows=[], html=Markup("<p style='color:red; font-size:12px; text-align:center;'>Your question could not be classified!<p>"))
        
        for r in rows:
            if rmin == 0:
                rmin=r['distance']     
            else:
                if rmin > r['distance']:
                    rmin=r['distance']
            if rmax < r['distance']:
                rmax=r['distance']
                       
        for r in rows: 
           if rmin==rmax:
               d=constants.tagcloud_font
           else:
               d=constants.tagcloud_minfont+(constants.tagcloud_minfont*(r['distance']-rmin)/(rmax-rmin))
           
           if r['level']==1:
               d+=constants.value_level_1
           elif r['level']==2:
               d+=constants.value_level_2
           if d>constants.tagcloud_maxfont:
               d=constants.tagcloud_maxfont
                                        
           html += template % (d,r['label'])
                
        return dict(keywords= bow.keys(), rows=rows, html=Markup(html))
    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def getKeywords(self, *args, **kwargs):
        '''
            Extracts keywords from the query - simple version
            
            @param text of the query: 
            @return: extracted keywords 
        '''
           
        text = kwargs['text']
        
        bow = extractor.createDictionaryFromText(text)
        return dict(keywords= bow.keys())
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.waitsearch")
    def getWaitSearchContent(self, query_id, *args, **kwargs):
        '''
            Serves content about the current status of the query (which experts are contacted, has anybody declined etc...)
            to the loqged in user , after the query has been posted. Also provides related notes.
            
            @param query_id: identifies the query
            @return: values needed for the template
        '''
        
        query = session.query(Query).get_by(query_id=int(query_id))
      
        if not query:
            raise redirect("/content/search/getQueryOverviewContent/"+query_id)

        #TODO: add matching logic here!!
        blog_entries = query.relatedBlogs
        length_blog_entries = len(blog_entries)        

        blogs = [{"topic": entry.title,
                    "id": entry.blogentry_id,
                    "user_id": entry.user_id,
                    "created": helpers.formatDate(entry.created),
                    "last_changed": entry.lastChanged,
                    "categories": entry.getCategoriesString(),
                    "user_name": session.query(User).get_by(user_id = entry.user_id).display_name} for entry in blog_entries]
        
        experts = self.getExperts(int(query_id))
        
        dic = {"text": query.text,
                "created": helpers.formatDate(query.created),
                "topic": query.getTopicString(True),
                "id": query.query_id,
                "blogs": blogs,
                "lengthBlogEntries": length_blog_entries,
                "query_status":query.status,
                "profile": query.getCategoriesString(),
                "all_experts":experts}
        
        expert_strings = {"experts":"","experts_accepted":"","experts_declined":""}
        
        for type in expert_strings:
            for expert in experts[type]:
                expert_strings[type] += expert + ", "
        
        state=experts['state']
        dic['doPolling'] = 'True'
        
        if (state=='accepted') or (state=='all_declined') or (state=='nobody_available'):
            dic['doPolling'] = 'False'
            
        dic.update(experts)
        dic['expert_strings'] = expert_strings
        
        return dic
    
    def getExperts(self, query_id):
        '''
            Fetches the experts and their status for a given query. State of the query is also calculated,
            and information about refreshing of the content as well.
            
            @param query_id: identifies the query
            @return: dict with information about status for all experts initially contacted, state of the 
                query and info about refreshing
        '''
        
        query = session.query(Query).get_by(query_id=query_id)        
        
        if not query:
            return {"experts":[], "experts_accepted":[], "experts_declined":[], "experts_offline":[]}
        
        queryExperts = list(session.query(QueryExpert).select(QueryExpert.c.query_id == query_id))
        
        ids_experts_offline = []
        ids_experts_declined = []
        ids_experts_accepted = []

        #an expert accepted
        if len(queryExperts) == 0:
            cs = query.chatSession
            if cs:
                id = cs.expert_id
                experts = [session.query(User).get_by(User.c.user_id==id)]
                ids_experts_accepted.append(experts[0].user_id)
            else:
                experts = []
        else:
            experts = query.experts
            for queryExpert in queryExperts:
                if queryExpert.status == "DECLINED":
                    ids_experts_declined.append(queryExpert.expert_id)
                    continue
                if queryExpert.status == "ACCEPTED":
                    ids_experts_accepted.append(queryExpert.expert_id)
                    continue
                expert=session.query(User).get_by(queryExpert.expert_id==User.c.user_id)
                if not expert.isOnline():
                    ids_experts_offline.append(queryExpert.expert_id)
                
        experts = {"experts": [expert.display_name[:20] for expert in experts],
                   "expert_ids": [[expert.user_id, expert.display_name[:20]] for expert in experts],
                    "experts_accepted": [expert.display_name[:20] for expert in experts if expert.user_id in ids_experts_accepted],
                    "experts_declined": [expert.display_name[:20] for expert in experts if expert.user_id in ids_experts_declined],
                    "experts_offline": [expert.display_name[:20] for expert in experts if expert.user_id in ids_experts_offline]}

        the_same=experts["experts_declined"]+experts["experts_offline"]
        the_same.sort()
        
        #user_id 2 user_name for tooltip refs
        experts['expert_ids'].sort(lambda x,y: cmp(x[1], y[1]))        
        
        expert_list=experts["experts"]
        expert_list.sort()
        if cmp(the_same,expert_list)==0 and len(experts["experts"])!=0 and len(experts["experts_offline"])!=0:
            overlap=True
        else:
            overlap=False
        experts["overlap"]=overlap
        
        
        if len(experts["experts_accepted"])>0:
            state='accepted'
        elif len(experts["experts"])==0:
            state='nobody_available'
        elif len(experts["experts_offline"])==len(experts["experts"]):
            state='all_offline'
        elif len(experts["experts_declined"])==len(experts["experts"]):
            state='all_declined'
        elif overlap:
            state='all_offline'
        else:
            state='at_least_one_online'
        
        experts['state']=state
        experts['finished'] = False
        if (state=='accepted' or state=='all_declined' or state=='nobody_available'):
            experts['finished'] = True
 
        return experts                              
            
    @expose(format="json")
    def getExpertsStatus(self, query_id, *args, **kwargs):
        '''
            ?  get the experts nd their status for a given query
        '''
        experts = self.getExperts(int(query_id))
        
        # all experts doesn't change and doesn't has to be sent therefore
        del experts['experts']
        return experts
                                    
    @expose(format="json")
    def doDecline(self, query_id, *args, **kwargs):
        '''
            Allows expert to decline query. Updates query logging.
            
            @param query_id: identifies the query
        '''
        try:
            queryExpert = session.query(QueryExpert).select(
                                      and_(QueryExpert.c.query_id == query_id, 
                                      QueryExpert.c.expert_id == identity.current.user.user_id)
             )[0]
        except:
            return {}
                
        queryExpert.status = "DECLINED"
        session.save(queryExpert)
        session.flush()
        
        query_log = QueryLog(
                query_id=int(query_id),
                user_id=queryExpert.expert_id,
                user_name=session.query(User).get_by(user_id=queryExpert.expert_id).user_name,
                status='Declined',
                created=datetime.now())
        session.save(query_log)
        
        no_declined=0
        query=session.query(Query).get_by(query_id=int(query_id))
        queryExperts = list(session.query(QueryExpert).select(QueryExpert.c.query_id == query_id))
        for qe in queryExperts:
            if qe.status == "DECLINED":
                no_declined+=1
        if no_declined==len(queryExperts):
            query_log_all = QueryLog(
                query_id=int(query_id),
                user_id=query.user_id,
                user_name=session.query(User).get_by(user_id=query.user_id).user_name,
                status='Everybody declined',
                created=datetime.now())
            session.save(query_log_all)
       
        session.flush()
        return {}
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.queryoverview")
    def getQueryOverviewContent(self, query_id, *args, **kwargs):
        '''
            Serves information about query to the expert who got it.
            
            @param query_id: identifies the query
            @return: values needed for the template
        '''
        
        query = session.query(Query).get_by(query_id=int(query_id))
        
        if query:
            taken = query.chatSession != None
            declined = False
            isContactedExpert = False # the expert was returnd by the matching algo
            
            if not taken:
                try:
                    contact = session.query(QueryExpert).select(
                                              and_(QueryExpert.c.query_id == int(query_id), 
                                              QueryExpert.c.expert_id == identity.current.user.user_id)
                     )[0]
                    if contact and contact.status == "DECLINED":
                        declined = True
                    isContactedExpert = True
                except:
                    pass

            isOverloaded = not isContactedExpert and session.query(User).get_by(user_id = identity.current.user.user_id).getIncomingLoad() > 4
            
            #print query.query_id, query.topic
            date = helpers.formatDate(query.created)
                
            return {
                      "text": query.text,
                      "topic": query.getTopicString(False),
                      "id": query.query_id,
                      "date": date,
                      "taken":taken,
                      "declined":declined,
                      "categories":query.getCategoriesString(),
                      "user": session.query(User).get_by(user_id = query.user_id).display_name,
                      "user_id": query.user_id,
                      "isContactedExpert": isContactedExpert,
                      "isOverloaded": isOverloaded
                   }
        # no query
        else:
            return {"deleted":True}
    
       
    @expose(format="json")
    def getQueryStatus(self, query_id, *args, **kwargs):
        '''
            Informs whether a query is taken by someone or not.
                
            @param query_id: identifies the query
            @return: true if query is taken ?
        '''
        
        try:
            query = session.query(Query).get_by(Query.c.query_id == int(query_id))
            return {"taken": query.status != "OPEN"}
        
        #no query
        except:
            # it's not realy taken but this triggers the reloading of the content
            return {"taken": True}
        
        
    @expose(format="json")
    def deleteQuery(self, query_id, *args, **kwargs):
        '''
            Allows user to delete a query. Updates query logging.
            
            @param query_id: identifies the query
            @return: status of attempted  delete operation of the query
        '''
        
        query = session.query(Query).get_by(query_id=int(query_id))
        
        status = ""
        
        if not query:
            status = "Query not found"
        elif session.query(ChatSession).get_by(query_id=int(query_id)):
            status = "Chat already started"
        elif query.user_id != identity.current.user.user_id:
            status = "Permission denied"
        else:
            query.experts[:] = []
            query_log=QueryLog(
                query_id = int(query_id),
                user_id = query.user_id,
                user_name = session.query(User).get_by(user_id=query.user_id).user_name,
                created = datetime.now(),
                status = 'Deleted')

            session.save(query_log)
            session.flush()
            session.delete(query);
            session.flush();
            
        return dict(status=status)    
    
    @expose(format="json")
    def getUsers(self, *args, **kwargs):
        '''
            @return: all the users except the current user and their online status
        '''
        
        users = User.select(User.c.user_id != identity.current.user.user_id,
                            order_by=[asc(User.c.display_name)])
        ret = {'users':[]}
        for user in users:
            entry = {}
            entry['name'] = user.display_name
            entry['uid'] = user.user_id
            entry['isonline'] = user.isOnline()
            ret['users'].append(entry)
        
        return ret
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.allquestions")
    def getAllOpenQuestionsContent(self, *args, **kwargs):
        '''
            All open questions except the questions of the current user
            
            @param kwargs: kwargs["page"] is the current page (pagination)
            
            @return: fills the allquestions template 
        '''
        myID = identity.current.user.user_id
        
        limit = 10 # max entries / page
        page = int(kwargs.get('page','1'))
        offset = limit * (page - 1)
        
        # give experts this time in seconds of advantage
        delay = 60
        
        no_questions = session.query(Query).count(                        
                        and_(
                             Query.c.isDirect == 0,
                             Query.c.user_id != myID,
                             Query.c.status == "OPEN",
                             Query.c.created < datetime.now() - timedelta(seconds = delay)
                        )
                        )
                        
        questions = session.query(Query).select(
                        and_(
                             Query.c.isDirect == 0,
                             Query.c.user_id != myID,
                             Query.c.status == "OPEN",
                             Query.c.created < datetime.now() - timedelta(seconds = delay)
                        ),
                        limit = limit, 
                        offset = offset, 
                        order_by=[desc(Query.c.created)])

        count = 0
        
        rows = []
        for q in questions:
            count += 1
            rows.append(
                       {"created":helpers.formatDate(q.created),
                        "count":count + offset,
                        "topic":q.getTopicString(False),
                        "user":q.user,
                        "query_id": q.query_id                        
                        }
            )
            
        no_pages = int(no_questions / limit) + 1
        
        from_ = offset + 1
        
        if no_questions == 0:
            from_ = 0
        
        to = count + offset
                
        return dict(questions = rows, 
                    no_pages = no_pages, 
                    current_page = page,
                    from_ = from_,
                    to = to,
                    no_questions = no_questions)
