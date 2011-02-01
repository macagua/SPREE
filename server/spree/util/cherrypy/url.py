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
    Provides functions for handling URLs
'''

def getBaseUrl():
    '''
        Returns the full http://... address of the current controller.
        Does not end with a traling slash.
        
        @return: the base url string (everything of the url before the last "/")
    '''
    
    import cherrypy
    
    # Trying to find the path to the controller.
    # If this has trouble, you may need to hardcode the return value
    # for this function
    last_slash = cherrypy.request.path.rfind('/')
    path = cherrypy.request.path[:last_slash]
    print cherrypy.request.base
    return '%s%s' % (cherrypy.request.base, path)

def getServerUrl():
    '''
        @return: the http://... address of the server.
    '''
    import cherrypy 

    return cherrypy.request.base
   
def getWebpath():
    import cherrypy 
    return cherrypy.webpath