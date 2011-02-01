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
    This model provides logging related table wrappers.
'''
import turbogears
from sqlalchemy import *
from sqlalchemy.ext.activemapper import ActiveMapper, column , one_to_many, one_to_one, many_to_many

from turbogears.database import metadata, session
from datetime import datetime
from spree import model
from spree.spree_model import Query


# for table automatic table creation only..

def create_report_tables():
    '''
        Creates the appropriate database tables.
    '''
    
    UserLog.table.create(checkfirst=True)
    QueryLog.table.create(checkfirst=True)
    ChatLog.table.create(checkfirst=True)
    
# Automatically create the registration tables when TurboGears starts up
turbogears.startup.call_on_startup.append(create_report_tables)


class UserLog(ActiveMapper):
    '''
        Collects information about user for logging purposes.
    '''
    
    class mapping:
        __table__ = "user_log"
        ulog_id = column(Integer, primary_key=True)
        user_name = column(String(16), nullable=False)
        user_id = column(Integer, nullable=False)
        login_time= column(DateTime, nullable=False)
        logout_time = column(DateTime)
        #autologout_time = column(DateTime)
        last_polling = column(DateTime)
        

class QueryLog(ActiveMapper):
    '''
        Collects information about query for logging purposes.
    '''
    
    class mapping:
        __table__ = "query_log"
        qlog_id = column(Integer, primary_key=True)
        query_id = column(Integer)#, foreign_key='query.query_id')
        user_name = column(String(16), nullable=False)
        user_id = column(Integer, nullable=False)
        created = column(DateTime, default=datetime.now)
        status = column(String(20), nullable=False)

        #query = one_to_one("Query", backref="query_log", lazy=True)
# possible status: New, Deleted, Accepted, Declined, Asked again

class ChatLog(ActiveMapper):
    '''
        Collects information about chat for logging purposes.
    '''

    class mapping:
        __table__ = "chat_log"
        clog_id = column(Integer, primary_key=True)
        query_id = column(Integer, nullable=False)
        user_id = column(Integer, nullable=False)
        user_name = column(String(16), nullable=False)
        expert_id = column(Integer, nullable=False)
        expert_name = column(String(16), nullable=False)
        exp_accepted = column(DateTime)
        user_joined = column(DateTime)
        who_ended = column(String(16))
        chat_ended = column(DateTime)
