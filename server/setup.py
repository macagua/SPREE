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
    Installation setup for spree
'''

from setuptools import setup, find_packages
from turbogears.finddata import find_package_data

import os
execfile(os.path.join("spree", "release.py"))

setup(
    name="spree",
    version=version,
    
    # uncomment the following lines if you fill them out in release.py
    #description=description,
    #author=author,
    #author_email=email,
    #url=url,
    #download_url=download_url,
    #license=license,
    
    install_requires = [
        "TurboGears >= 1.0b1",
        "SQLAlchemy", 
    ],
    scripts = ["start-spree.py"],
    zip_safe=False,
    packages=find_packages(),
    package_data = find_package_data(where='spree',
                                     package='spree'),
    keywords = [
        # Use keywords if you'll be adding your package to the
        # Python Cheeseshop
        
        # if this has widgets, uncomment the next line
        # 'turbogears.widgets',
        
        # if this has a tg-admin command, uncomment the next line
        # 'turbogears.command',
        
        # if this has identity providers, uncomment the next line
        # 'turbogears.identity.provider',
    
        # If this is a template plugin, uncomment the next line
        # 'python.templating.engines',
        
        # If this is a full application, uncomment the next line
        # 'turbogears.app',
    ],
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Framework :: TurboGears',
        # if this is an application that you'll distribute through
        # the Cheeseshop, uncomment the next line
        # 'Framework :: TurboGears :: Applications',
        
        # if this is a package that includes widgets that you'll distribute
        # through the Cheeseshop, uncomment the next line
        # 'Framework :: TurboGears :: Widgets',
    ],
    test_suite = 'nose.collector',
    )
    
