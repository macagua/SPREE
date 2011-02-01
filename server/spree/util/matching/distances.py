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
    Provides various distance functions
'''

def getOverlapBetweenGraphs(sub1,sub2):
    '''
        Calculates similarity measure between two graphs.
        
        @param sub1: the first subgraph for comparison
        @param sub2: the second subgraph for comparison
        @return: value of similarity measure
    '''
    
    if len(sub1) == 0 or len(sub2) == 0:
        return 0
    
    match_counter = 0

    for a in sub1:
        if a in sub2:
            match_counter += 1
            
    return match_counter / math.sqrt(len(sub1) * len(sub2))

def getDistanceCosine(bow1, bow2):
    '''
        Calculates the cosine distance between two bags of words (given as dictionaries).
        
        @param bow1: the first bag of words for comparison
        @param bow2: the second bag of words for comparison
        @return: value for cosine distance
    ''' 
    
    sum_ = 0
    
    i = set(bow1.keys()).intersection(set(bow2.keys()))
    
    for key1, value1 in bow1.iteritems():
        if key1 in bow2:
            sum_ += value1 * bow2[key1]
           
    return sum_

def getDistanceEuclid(bow1, bow2):
    '''
        Calculates the euclidian distance between two bags of words (given as dictionaries).
        
        @param bow1: the first bag of words for comparison
        @param bow2: the second bag of words for comparison
        @return: value for euclidian distance
    '''
    sum_ = 0
    
    for key1 in bow1:
        if key1 in bow2:
            sum_ += math.pow(bow1[key1] - bow2[key1], 2)
            
    return math.sqrt(sum_)