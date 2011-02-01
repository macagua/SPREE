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
from turbogears import testutil
from spree.controllers import Root
import cherrypy

cherrypy.root = Root()

def test_method():
    "the index method should return a string called now"
    import types
    result = testutil.call(cherrypy.root.index)
    assert type(result["now"]) == types.StringType

def test_indextitle():
    "The mainpage should have the right title"
    testutil.createRequest("/")
    assert "<TITLE>Welcome to TurboGears</TITLE>" in cherrypy.response.body[0]
