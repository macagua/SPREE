#!C:\Python24\python.exe
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
import pkg_resources
pkg_resources.require("TurboGears")

import turbogears
import cherrypy
cherrypy.lowercase_api = True

from os.path import *
import sys

'''
    Start the web application
'''

print "Default Encoding:", sys.getdefaultencoding();

# first look on the command line for a desired config file,
# if it's not on the command line, then
# look for setup.py in this directory. If it's not there, this script is
# probably installed
if len(sys.argv) > 1:
    turbogears.update_config(configfile=sys.argv[1], 
        modulename="spree.config")
elif exists(join(dirname(__file__), "setup.py")):
    turbogears.update_config(configfile="dev.cfg",
        modulename="spree.config")
else:
    turbogears.update_config(configfile="prod.cfg",
        modulename="spree.config")

from spree.controllers import Root

turbogears.start_server(Root())
