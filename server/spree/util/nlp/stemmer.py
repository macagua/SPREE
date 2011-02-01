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
    Provides stemming functionality
'''

from nltk_lite.stem.porter import *
stemmer = Porter() 
    
# use stemming for the keys of a histogramm dictionary as retrieved from 'getCountedDict'
# words that merge into the same word from after stemming and unified
def stemDict(counted_dict):
    '''
        Stems the words given in a dictionary. Words from a dictionary that got stemmed
        to the same root are fused.

        @param counted_dict: dictionary that contains words and their frequencies of appearance
        @return: stemmed and cleaned dictionary
    '''
    
    clean_dict=dict()
    for key, value in counted_dict.iteritems():
        stemmed_key = stemmer.stem(key)
        if stemmed_key in clean_dict:
            clean_dict[stemmed_key] += int(value)
        else:
            clean_dict[stemmed_key] = int(value)
        
    return clean_dict