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
    Adds a documentation header to certain file types (html, css, js, py)
'''

import os, sys, re
import datetime as dt

startFromDir = '.'
headerTplName = 'fileheader.tpl'

excludedDirs = ['libs', '.svn', 'images', '.settings', 'doc', 'spree.egg-info', 'data']
doctypes = [#{'name':'html', 'multiDocStart':'<!--', 'multiDocEnd':'-->'},
            {'name':'css', 'multiDocStart':'/*', 'multiDocEnd':'*/','multiDocStartEsc':'\/\*', 'multiDocEndEsc':'\*\/'},
            {'name':'js', 'multiDocStart':'/*', 'multiDocEnd':'*/', 'singleDoc':'//', 'multiDocStartEsc':'\/\*', 'multiDocEndEsc':'\*\/'},
            {'name':'py', 'multiDocStart':'\'\'\'', 'multiDocEnd':'\'\'\'', 'singleDoc':'#',
             'altMultiDocStart':'"""', 'altMultiDocEnd':'"""', 'multiDocStartEsc':'\'\'\'', 'multiDocEndEsc':'\'\'\''}
            ]
codingString = '^\s*# _\*_ coding: .*? _\*_\n'
linInstruction = '^\s*#!.*?\n' 
futureImport = '^from __future__.*?\n'

def insertHeader(file, doctype):
	f = open(file, 'r')
	fcontent = f.read()
	f.close()
	f = open(headerTplName)
	fheader = f.read()
	f.close()
	
	# remove header if already existent

	fcontent = re.sub('%s\s+?Copyright \(C\) 2008  Deutsche Telekom Laboratories[\S\s]*?%s\n' % (doctype['multiDocStartEsc'],doctype['multiDocEndEsc']), '', fcontent)
	
	preHeader = re.findall(linInstruction + '|' + codingString + '|' + futureImport, fcontent)
	if len(preHeader) > 0:
		preHeader = preHeader[0]
	else:
		preHeader = ''
    
	# replace template entities
	fheader = re.sub('<%DATE%>', dt.date.today().strftime('%d-%m-%Y'), fheader)
	# embed header in doc
	fheader = doctype['multiDocStart'] + '\n' + fheader + '\n' + doctype['multiDocEnd'] + '\n'
	# remove preheader from file
	fcontent = re.sub(linInstruction + '|' + codingString + '|' + futureImport, '', fcontent)
    
	#if doctype['name'] == 'py':
	#    print file
	#    print preHeader + fheader + fcontent
	#    sys.exit()
	f = open(file, 'w')
	fcontent = f.write(preHeader + fheader + fcontent)
	f.close()
    
#===============================================================================
#    patMulti = '^(?:%s)?\s*%s[\s\S]*?%s' % (codingString, doctype['multiDocStart'], doctype['multiDocEnd'])
#    
#    if 'altMultiDocStart' in doctype:
#        patAltMulti = '^(?:%s)?\s*%s[\s\S]*?%s' % (codingString, doctype['altMultiDocStart'], doctype['altMultiDocEnd'])
#        
#    if 'singleDoc' in doctype:
#        patSingle = '^(?:%s)?\s*((?:%s.*?\n)+)' % (codingString, doctype['singleDoc'])
#
#        header = re.findall(patSingle, fcontent)
#        
#        if file == '.\spree\crawler\manager.py':
#            print header
#            header = re.sub('(?:^|\n)\s*' + doctype['singleDoc'], '\n', header[0])
#            print re.sub(patSingle, preHeader + 'bladavor %s bladanach' % header, fcontent)[:400]
#===============================================================================


def goForIt():
    for path, dirs, files in os.walk(startFromDir, True):
        for exdir in excludedDirs:
            if exdir in dirs:
                dirs.remove(exdir)
                
        for file in files:
            for doctype in doctypes:
                fullpath = os.path.join(path,file)
                if file.endswith('.' + doctype['name']) and os.path.getsize(fullpath) > 0:
                    insertHeader(fullpath, doctype)
                    #sys.exit(0)
if __name__ == "__main__":
    goForIt()              

        
