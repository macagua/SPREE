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
    Provides various utility functions
'''
from datetime import datetime
from time import strftime

def formatDate(d):
        '''
            Transforms a date to a date string in german date format
            and replaces it with today if needed.
            
            @param d: date in us date format
            @return: date in german date format, or today if it is current date
        '''
        
        if not d:
            return ""
        
        t = strftime('%H:%M:%S',d.timetuple())
        if datetime.today().date() == d.date():
            date = "today " + t
        else:
            date = strftime("%d.%m.%Y",d.date().timetuple()) + " " + t
            
        return date