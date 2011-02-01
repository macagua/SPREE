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
    This model provides wrappers for the website table. 
    This table is only used during the registration process 
    when the user specifies his websites of interest.
    
    In parallel, the website table is used by the crawler that checks whether
    new websites need to be downloaded and classified.
'''
import turbogears
from turbogears.database import metadata

from sqlalchemy import *
from sqlalchemy.ext.activemapper import ActiveMapper, column
import sqlalchemy.databases.mysql as mysql#

from datetime import datetime

class Website(ActiveMapper):
    '''
        Holds information about websites.
    '''
    
    class mapping:
        __table__ = "websites"
        id = column(Integer, primary_key=True)
        url = column(String(200), nullable=False)
        alpha = column(Float, nullable=False)
        subgraph = column(mysql.MSText)
        crawl = column(Integer, nullable=False, default = 1) # crawler should download this site 
                                                             # (set to false by cralwer once the site was downloaded)
        error_code = column(String(200), default = "") # the error_code returned by the crawler
        status = column(String(200), default = "") # the status returned by the crawler
        time_added = column(DateTime, default=datetime.now)
        time_modified = column(DateTime, default=datetime.now)
        user_id = column(Integer)

def create_tables():
    '''
        Creates the appropriate database table.
    '''
    Website.table.create(checkfirst=True)

turbogears.startup.call_on_startup.append(create_tables)

