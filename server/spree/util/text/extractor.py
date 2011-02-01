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
    Provides functions for extracting terms out of documents
'''

from nltk_lite import tokenize
import re

from spree.util.nlp import stemmer
from spree.util.list import wordlist
from spree.submodels import stopword_model

pattern = re.compile(r'''[a-zA-Z]+''', re.VERBOSE)
    
def extractWords(text):
    '''
        Extract all the words from a given text.
        
        @param text: input text
        @return: the list of all found words
    '''

    words = list(tokenize.regexp(text.lower(), pattern))
    return words

def createDictionaryFromText(text, word_limit=-1):
    '''
        Creates a dictionary consisting of stemmed words associated with their frequency of occurrence.
        Stop words are removed and dictionary is cleaned (all the words with same stems are fused into
        one occurrence in the dictionary).

        @param text: imput text
        @param word_limit: only take the first n words of the text
        @return: cleaned dictionary
    '''
    
    words = stopword_model.removeStopwords(extractWords(text))
    
    if word_limit > 0:
        words = words [:word_limit]
        
    dict = stemmer.stemDict(wordlist.getCountedDict(words))
    return dict