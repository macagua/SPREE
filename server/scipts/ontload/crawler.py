# _*_ coding: utf8 _*_

# a crawler which recusivly gets all websites containing in the 'www.out' files
# all sites are converted from html to txt and then stored with a ".txt" extension

import os, urllib2, threading
from html2text import html2textfile

import settings

filename = settings.yahoo.filename_url
file_ext = ".txt"

# the crawler thread class
class crawler(threading.Thread):
    
    #current processes/threads
    processes = []
    
    #max threads
    maxthreads = 25
    
    evnt = threading.Event()
    lck = threading.Lock()
    
    # dir - the directory to crawl the sites for
    def __init__(self, dir):
        threading.Thread.__init__(self)
        self.dir = dir
    
    # run the crawler
    def run(self):
        getSites(self.dir)
        crawler.lck.acquire()
        crawler.processes.remove(self)
        if(len(crawler.processes) == crawler.maxthreads -1):
            crawler.evnt.set()
            crawler.evnt.clear()
        crawler.lck.release()
    
    # create a new crawler
    def newthread(dir):
        crawler.lck.acquire()
        crwl = crawler(dir)
        crawler.processes.append(crwl)
        crawler.lck.release()
        crwl.start()
        
    newthread = staticmethod(newthread)
        
# check if site is html, download it, convert it to text and write it to a file
def getSite(address, dir):
    bannedStrList = ['.pdf','.swf','.ps','.ppt','.doc','.PDF','.SWF','.PS','.PPT','.DOC','.exe'];
    
    #check if address is not allowed
    for bannedStr in bannedStrList:
        if address.endswith(bannedStr):
            print "Y %s is no html!" %(address)
            return;
    
    filename = address[7:]
    filename = filename.replace("/","___")
    filename = filename.replace("\r","")
    endIdx = filename.find("?")
    if endIdx != -1:
        filename = filename[:endIdx]
    filename += ".y.txt"
    filepath = os.path.join(dir, filename)
    
    if os.path.isfile(filepath) and os.path.getsize(filepath) > 20:
        print "File %s already exists." % filename
        return
    
    html2textfile(address, filepath)
    
# downloads all sites for a given file containing the list of www-addresses
def getSites(file):
    for address in open(file,"r"):
        getSite(address[:-1], os.path.dirname(file))
        
# crawls the directory and all subdirectories looking for the 'www.out' files and
# downloads all files specified in 'www.out' to the current subdirectory
# all files are converted from html to text
#
# Crawling is done using different threads to avoid blocking
def crawl(base_dir):
    
    MAXPROCESSES = 25; # Parameter to parallelize web crawling, keeps the bursty/blocking HTTP traffic flowing and
    
    numProcesses = 0;

    # get all 'www.out' files
    for path, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(filename):
                filepath = os.path.join(path, file)
                
                crawler.lck.acquire()
                
                # wait when number of crawl threads exeeds limit
                if len(crawler.processes) >= crawler.maxthreads:
                    crawler.lck.release()
                    crawler.evnt.wait()
                else:
                    crawler.lck.release()
                # start new crawl thread
                crawler.newthread(filepath)
    
    #kill threads      
    for p in crawler.processes:
        p.join()

def usage():
    print "Usage: python crawler.py <dir>"
    
if __name__ == "__main__":
    import sys
    
    usage();

    args = sys.argv[1:]
    
    if len(args) != 1:
        print "Wrong number of arguments."
        sys.exit(2)
  
    crawl(args[0])