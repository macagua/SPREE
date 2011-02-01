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
    A model for wrapping the stopwords table and providing methods
    related to these stopwords.
'''

import turbogears

from sqlalchemy import *
from sqlalchemy.ext.activemapper import ActiveMapper, column
                                    
from turbogears.database import metadata, session

default_stopwards_file = "spree/data/corpora/stopwords/english"

def create_tables():
    '''
        Creates the appropriate database tables.
    '''
    Stopword.table.create(checkfirst=True)
    if session.query(Stopword).count() == 0:
        load(default_stopwards_file);

# Automatically create the registration tables when TurboGears starts up
turbogears.startup.call_on_startup.append(create_tables)

def load(filename):
    '''
        Loads a list of stopwords from a given file.
        The list is ordered and has only unique entries.
        
        @param filename: file that contains stopwords (each line one word)
    '''
    
    if session.query(Stopword).count() > 0:
        Stopword.table.delete().execute()

    if filename == "":
        filename = default_stopwards_file;
        
    stopwords = [line.rstrip() for line in open(filename,"r")]
    print "Loading %d stopwords ... " % len(stopwords)
    
    Stopword.table.insert().execute([{"word":w} for w in stopwords])
 
class Stopword(ActiveMapper):
    '''
        Wrapper of stopwords table.
    '''
    
    class mapping:
        word = column(String(20), primary_key=True)
    
# remove all words from a list of words that are contained in the stopword list
def removeStopwords(words):
    '''
        Removes all the words from a list of words that are contained in the stopword list.
        
        @param words: list of words to be filtered
        @return: list of filtered words
    '''
    
    if(len(words) == 0):
        return words
    
    stopwords = [rec.word for rec in session.query(Stopword).select()]
    
    words = filter(lambda word: not word in stopwords,words)
    return words