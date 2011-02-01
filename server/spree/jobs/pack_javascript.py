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
    Pack all *.js files to one file and compress it renaming variables and removing whitespaces.
    
    This way we avoid having HTTP-Requests for each *.js file and the compression decreases the file_size
    by about 40%.
'''

import os

path_to_js ="spree/static/javascript/"

exclude_dirs = [".svn","libs", "layout","packed"]

file_out_tmp = "packed/spree.tmp.js"
file_out = "packed/spree.js"

compress_cmd ="java -jar spree/jobs/lib/custom_rhino.jar -c %s > %s 2>&1"

files = []

def loadFiles(dir = path_to_js):
    '''
        get all *.js files and add them to the list
    '''
    for file in os.listdir(dir):
        path = os.path.join(dir, file)
        if os.path.isdir(path):
            skip = False
            for ex in exclude_dirs:
                if ex in file and file.index(ex) == 0:
                    skip = True
                    continue
            if skip:
                continue
            loadFiles(path)
        else:
            if file[-3:] == ".js":
                files.append(path)
     
def packJS(filename=os.path.join(path_to_js,file_out_tmp)):
    '''
        merge all *.js files to one file
    '''
    out = open(filename,"w")
    
    for file in files:
        in_ = open(file,"r")
        for line in in_:
            out.write(line)
        out.write("\n");
        in_.close()
        
    out.close()
    
def compressJS(filein=os.path.join(path_to_js,file_out_tmp), fileout=os.path.join(path_to_js,file_out)):
    '''
        remove comments and whitespaces (~40% reduction in file size) using moz. rhino package
    '''
    compress_cmd_ = compress_cmd % (filein, fileout)
    os.system(compress_cmd_)
    print "  Wrote output to ", fileout

def packAll():
    '''
        merge all *.js files to one file and remove unnecessary stuff (whitespaces etc)
        
        (only called in development mode !)
    '''
    print "Packing all javascript files"
    loadFiles()
    packJS()
    compressJS()
    
if __name__ == "__main__":       
    loadFiles()
    packJS()
    compressJS()

