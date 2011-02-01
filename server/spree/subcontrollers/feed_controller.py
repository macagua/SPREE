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
    Controller for providing rss feeds
'''
import datetime

from sqlalchemy import *

from turbogears.feed import FeedController
from turbogears import identity,controllers, expose, config
from turbogears.database import session

from spree.model import User
from spree.util.cherrypy.url import getServerUrl
from spree.spree_model import Query,QueryExpert,query_expert_table, ChatSession, ChatMessage


class NewsFeedController(FeedController):
    
    
    @expose(template="spree.templates.rss2_0", format="xml", content_type="application/rss+xml")
    def rss2_0(self, **kwargs):
        feed = self.get_feed_data(kwargs)
        self.format_dates(feed, 822)
        self.depr_entrys(feed)
        return feed
    
    
                 
    #@expose(template="spree.templates.rss2_0", format="xml", content_type="application/rss+xml")
    #@expose(format="json")
    def get_feed_data(self, kwargs):
        '''
            Prepares content for RSS feed. If not personalized RSS is going to display five latest 
            questions posted on the Spree system, excluding direct questions. If personalized, RSS is 
            going to display latest questions and and a message about user's questions that have been 
            accepted. The content of the question summery is limited to 200 characters.
    
            @param kwargs: if user_name is provided, RSS can be personalized
            @return: values needed for the template
         '''
        
        entries = []
        
        if not kwargs:
            user_name = ''
        else:
            user_name=kwargs.get('user_name','')

        rss_server=getServerUrl()+'/'
        
        if user_name == '':
            
            new_questions=session.query(Query).select(and_(
                                     Query.c.status == "OPEN", 
                                     Query.c.isDirect == 0),
                                     order_by=[desc(Query.c.created)], 
                                     limit=5
                           )
            
        else:
            u=session.query(User).get_by(User.c.user_name==str(user_name))
            handshakes = session.query(QueryExpert).select(
                                  and_(
                                       QueryExpert.c.expert_id == u.user_id,
                                       QueryExpert.c.status=='HANDSHAKE'
                                  )
                          )

            new_questions = session.query(Query).select(Query.c.query_id.in_(*[row.query_id for row in handshakes]))
                
            accepted = session.query(Query).select(
                                    and_(
                                        Query.c.user_id==u.user_id,
                                        Query.c.status=='HANDSHAKE'
                                    )
                            )

            for q in accepted:
                foo = {}
                foo["acreated"] = q.created
                foo["title"] = q.getTopicString(False)
                foo["author"] = user_name
                foo["summary"] = 'Your question has been accepted:'+'\n'+ '('+q.text[:170]+')'
                foo["id"] = rss_server
                entries.append(foo)
                        
        for query in new_questions:
            foo = {}
            foo["acreated"] = query.created
            foo["title"] = query.getTopicString(False)
            foo["author"] = User.select(User.c.user_id == query.user_id)[0].display_name
            foo["summary"] = query.text[:200]
            foo["id"] = rss_server
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
            title="SPREE latest questions",
            description="SPREE latest questions",
            link=rss_server,
            author = {"name":"spreeprovider","email":""},
            id = rss_server,
            subtitle="SPREE - incoming questions",
            entries=entries
        )
        
        return dic
    
    
    
   