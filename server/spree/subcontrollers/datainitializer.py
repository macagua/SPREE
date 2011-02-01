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

import turbogears
import cPickle, datetime

from turbogears import controllers, expose, redirect

from sqlalchemy import *
from turbogears.database import session

from spree.model import User, UserStats
from spree.spree_model import Query

from spree.submodels import tree_model

from spree.jobs import pack_javascript

'''
    Functions for adding some initial data to a fresh start up.
    Provides also functions for subsequently altering running
    database tables
'''

def fill_tables():
    '''
        Checks if there are any users in a user table.
        If there is none loads some for testing purposes.
    '''
    
    number_of_rows = User.table.count().execute().fetchone()[0]
    if number_of_rows == 0:
        loadUsers()
        
    checkForDirectChat()
        
def resetQueryTimes():
    '''
        Resets query times.
    '''
    
    print "Resetting queries"
    
    queries = session.query(Query).select()
    
    for q in queries:
        q.created = datetime.datetime.now()
        session.save(q)
        
    session.flush()
    
def addIsOnlineColumn():
    '''
        Checks if isOnline column is in the user_stats table. If it isn't, the table is altered and column is added.
    '''
    try:
        select([UserStats.c.isOnline], limit=1).execute()
        print "UserStats.isOnline in model"
    except:
        print "Adding UserStats.isOnline column"
        text("ALTER TABLE `spree_dev`.`user_stats` ADD COLUMN `isOnline` INTEGER UNSIGNED NOT NULL DEFAULT 0 AFTER `user_id`;", 
             turbogears.database.metadata.engine).execute()
        text("ALTER TABLE `spree_dev`.`user_stats` ADD COLUMN `isOnlineLastUpdated` DATETIME NOT NULL DEFAULT 0 AFTER `isOnline`;", 
             turbogears.database.metadata.engine).execute()
        
        #complete the adding of columns first     
        addRankColumn()
             
        stats = UserStats.select()
        
        for s in stats:
            s.isOnline = s.user.isOnline()
            s.isOnlineLastUpdated = datetime.datetime.now()
            session.save(s)
            session.flush()
            
def addRankColumn():
    '''
        Checks if isOnline column is in the user_stats table. If it isn't, the table is altered and column is added.
    '''
    try:
        select([UserStats.c.rank], limit=1).execute()
        print "UserStats.rank in model"
    except:
        print "Adding UserStats.rank column"
        text("ALTER TABLE `spree_dev`.`user_stats` ADD COLUMN `rank` INTEGER UNSIGNED NOT NULL DEFAULT 0 AFTER `user_id`;", 
             turbogears.database.metadata.engine).execute()
        text("ALTER TABLE `spree_dev`.`user_stats` ADD COLUMN `rankLastUpdated` DATETIME NOT NULL DEFAULT 0 AFTER `rank`;", 
             turbogears.database.metadata.engine).execute()
        
        stats = UserStats.select()
        
        for s in stats:
            s.rankLastUpdated = datetime.datetime.now()
            s.user.getRank()
            session.save(s)
            session.flush()    
            
turbogears.startup.call_on_startup.append(fill_tables)
turbogears.startup.call_on_startup.append(addIsOnlineColumn)
turbogears.startup.call_on_startup.append(addRankColumn)
#turbogears.startup.call_on_startup.append(resetQueryTimes)
if not turbogears.config.get("server.environment") == "production":
    turbogears.startup.call_on_startup.append(pack_javascript.packAll)


def loadUsers():
    '''
        Automatically fill some tables when TurboGears starts up.
    '''
    print "Loading some initial users ..."
    
    users = ["guest","tansu","christian","florian","sachin","milena","robert","mitra","winfried", "caroline","kathrin","bastian"]
    emails = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]
    password = "password"
    
    firstLevelNodes = select([tree_model.ontologynode.c.node_id], tree_model.ontologynode.c.level == 1).execute()
    expertise = [int(e.node_id) for e in firstLevelNodes]
    
    index = 0
    for u in users:
        exp = {expertise[index % len(expertise)]: 3}
        newUser = User()
    
        newUser.user_name=u
        newUser.email_address=emails[index]
        newUser.display_name=u
        newUser.password = password
        newUser.expertise = cPickle.dumps(exp)
        newUser.expertise_subtree = cPickle.dumps(exp)
        newUser.user_stats = UserStats()
        session.save(newUser)
        session.flush() 
            
        print "Added user %s to the database. Expert in: %d" % (u, exp.keys()[0])
        index += 1
        
def checkForDirectChat():
    '''
        Checks if isDirect column is in a query table. If it isn't, the table is altered and columns added.
    '''
    
    from spree.spree_model import Query
    try:
        select([Query.c.isDirect], limit=1).execute()
        print "Direct Chats in model"
    except:
        print "Adding Direct Chats column"
        text("ALTER TABLE `spree_dev`.`query` ADD COLUMN `isDirect` INTEGER UNSIGNED NOT NULL DEFAULT 0 AFTER `user_id`;", 
             turbogears.database.metadata.engine).execute()
        
        queries = Query.select()
        
        for q in queries:
            if '(direct' in q.topic:
                q.isDirect = 1
                if q.topic.startswith("(direct"):
                    q.topic = ""
                else:
                    q.topic = q.topic.split(' (direct')[0]
                session.save(q)
                session.flush()
                
    
        