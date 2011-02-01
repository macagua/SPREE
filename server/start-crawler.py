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
import sys, os

from spree.crawler.manager import WebsiteCrawlManager

'''
    Start the website classifier that runs as a seperate process
'''

config_file = "dev.cfg"
connect_string = "mysql://username:password@localhost:3306/spree_dev"

if len(sys.argv) > 1:
    config_file = sys.argv[1]

file = open(config_file, "r")
for line in file:
    if line.startswith("sqlalchemy.dburi"):
        line = line.strip()
        connect_string = line[18:-1]
        break
    
print connect_string

wm = WebsiteCrawlManager(connect_string)
wm.start()