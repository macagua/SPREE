from __future__ import division
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

import math

'''
    Provides normalization functions
'''

def normalizeBow(bow, terms2idf):
    '''
        Normalizes a sparse vector to length 1 and applies tfidf.
       
       @param bow: a bag of words dictionary
       @param terms2idf: a dictionary of {term: inverse document frequency} expressions
       @return: bag of words vector normalized by tfidf of length 1.0
   '''

    for term, tf in bow.iteritems():
        idf = terms2idf.get(term, 0.0)
        bow[term] = tf * idf
    
    length = math.sqrt(sum(map(lambda x: x*x, bow.values())))
    
    if length == 0.0:
        return bow
    
    for key in bow:
        bow[key] /= length
    
    return bow