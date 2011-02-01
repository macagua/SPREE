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
    Functions for handling wordlists, e.g. converting it to a dictionary
'''

def getCountedDict(words):
    '''
        Creates a dictionary from the given list of words. Every word as key entry has its frequency
        of occurrence as associated value.
        
        @param words: list of words given
        @return: dictionary that has been formed
    '''
    
    counted_words = dict()
    for word in words:
        if word in counted_words:
            counted_words[word] += 1
        else:
            counted_words[word] = 1;
        
    return counted_words
