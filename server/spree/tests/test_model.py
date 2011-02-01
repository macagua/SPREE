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
# If your project uses a database, you can set up database tests
# similar to what you see below. Be sure to set the db_uri to
# an appropriate uri for your testing database. sqlite is a good
# choice for testing, because you can use an in-memory database
# which is very fast.

from turbogears import testutil, database
# from spree.model import YourDataClass, User

# database.set_db_uri("sqlite:///:memory:")

# class TestUser(testutil.DBTest):
#     def get_model(self):
#         return User
#     def test_creation(self):
#         "Object creation should set the name"
#         obj = User(user_name = "creosote",
#                       email_address = "spam@python.not",
#                       display_name = "Mr Creosote",
#                       password = "Wafer-thin Mint")
#         assert obj.display_name == "Mr Creosote"

