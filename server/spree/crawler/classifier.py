# _*_ coding: latin1 _*_
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
 clasifier.py
 
 Class offering methods for web-site classification
'''

import re, cPickle

from sqlalchemy import *
import sqlalchemy.databases.mysql as mysql
from nltk_lite import tokenize

from spree.util.nlp import stemmer
from spree.util.list import wordlist
from spree.util.matching import normalization

from spree.submodels.ontologytree_slim import OntologyTree

class Classifier(object):
    '''
        the main class
    '''    
    connect_string = None
    stopwords = None
    pattern = re.compile(r'''[a-zA-Z]+''', re.VERBOSE)
            
    tree = None
    term_table = None
    
    alpha = 1.5
    maxterms = 2000
    
    def __init__(self, connect_string):
        '''
            load stopwords once
            
            create persistent tree for later classification
        '''
        self.connect_string = connect_string
        self.loadStopwords()
        
        metadata = BoundMetaData(self.connect_string)
        self.term_table = Table('dictionary',metadata,
            Column('term_id',Integer, primary_key=True),
            Column('term', String(20), unique=True, nullable=False),
            Column('idf', Float, default = 0.0, nullable=False),
            Column('nodes',mysql.MSLongText)
        )

        self.tree = OntologyTree()
        ont_table = Table('ontologynode', metadata,
            Column('node_id',Integer, primary_key=True),
            Column('name', String(200), nullable=False),
            Column('level',Integer, nullable=False),
            Column('leftIdx', Integer, unique=True, nullable=False),
            Column('rightIdx', Integer, unique=True, nullable=False)
        )
        self.tree.formTree(ont_table)

    def loadStopwords(self):
        '''
            load the stopwords from the db and store them persistently
        '''
        metadata = BoundMetaData(self.connect_string)
        stopword_table = Table('stopword', metadata,
            Column('word', String(20))
        )
        words = stopword_table.select().execute()
        
        stopwords = []
        for row in words:
            stopwords.append(row.word)
            
        self.stopwords = stopwords
    
    # get all words from a given text
    def extractWords(self, text):
        '''
            get words from a string
        '''
        words = list(tokenize.regexp(text.lower(), self.pattern))
        return words

    def createDictionaryFromText(self, text, word_limit=-1):
        '''
            created a bag-of-words from a given text
            
            includes stopword removal, stemming, term frequency
        '''
        text = text[:(15*word_limit)]
        words = self.extractWords(text)
        if word_limit > 0:
            words = words[:(3*word_limit)]
        words = filter(lambda x: x not in self.stopwords, words)
        if word_limit > 0:
            words = words [:word_limit]
            
        dict = stemmer.stemDict(wordlist.getCountedDict(words))
        return dict
    
    def classify(self, text):
        '''
            classify a given text using the category tree
        '''
        #print "Creating dictionary"
        bow = self.createDictionaryFromText(text, self.maxterms)
        #print "Retrieving wieghts"
        weighted_nodes = self.getWeightedNodes(bow)
        #print "Calcualting path"
        path = self.tree.classifyPreWeighted(weighted_nodes, self.alpha)
        #print "Done."
        return (path, bow)        
        
    def getWeightedNodes(self, terms):
        '''
            returns calculated score (all nodes where any of the word appears) for given words
            terms is a dictionary of words    
        '''
        
        dict = self.term_table
        sel = select([dict.c.term_id, dict.c.nodes, dict.c.term, dict.c.idf],dict.c.term.in_(*terms.keys())).execute()
        rows=sel.fetchall()
        
        terms2idf = {}
        for row in rows:
            terms2idf[row.term] = row.idf
            
        terms_normalized = normalization.normalizeBow(terms, terms2idf)
        
        selected_nodes = {}
            
        for row in rows:
    
            nodes = cPickle.loads(row.nodes.encode('latin1'))
    
            for node_id in nodes.keys():
                if node_id in selected_nodes:
                    selected_nodes[node_id] += nodes[node_id] * terms_normalized[row.term]
                else:
                    selected_nodes[node_id] = nodes[node_id] * terms_normalized[row.term]
    
        del rows
        return selected_nodes