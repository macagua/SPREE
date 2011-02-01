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
 manager.py
 
 Crawls web-pages for the registration process
 crawling is done as extra process to avoid bottlenecks

 This class uses the database as blackboard (websites table)
 the server adds new pages to the db the crawler continously
 checks the db for new sites and crawls them writing the results
 back to the db
 
 rw
'''

import time, threading, datetime, cPickle

from sqlalchemy import *
import sqlalchemy.databases.mysql as mysql

from spree.crawler.classifier import Classifier
from spree.util.crawler import html2text
from spree.util.text import extractor

classifier = None
website_table = None
engine = None

def crawlSite(site):
    '''
        download the site, extract the text, get keywords, stem, classify
        
        writes the result for the site back to the db
    '''
    global classifier
        
    status = "ok"
    path = []
    
    #crawl the site
    try:
        (success, text) = html2text.html2txt(site)
    
        if success == 1:
            (path, bow) = classifier.classify(text)
        else:
            bow = {}
       
        #filter empty sites
        if len(bow) < 20:
            status = "site contained not enough data"
            path = []
    except:
        status = "download failed"
        
    updateSite(site, status, path)
    
def updateSite(site, status, path):
    '''
        update the site with the status and categories
    '''
    dic = {'url': site,
           'status':status,
           'subgraph':cPickle.dumps(path),
           'crawl':0}
    
    website_table.update(website_table.c.url==bindparam('url')).execute(dic)
    Crawler.currently_crawled_sites.remove(site)
    
    print "Downloaded %s Status: %s" %(site, status)
    
class Crawler(threading.Thread):
    '''
        The Crawler class.
        
        Sites are downloaded in parallel in different threads to avoid locks.
        
        Use the Crawler.newthread() method for creating a new instance.
    '''
    #current processes/threads
    processes = []
    
    #currently crawled sites
    currently_crawled_sites = []

    #max threads
    maxthreads = 5
    
    evnt = threading.Event()
    lck = threading.Lock()
    
    # dir - the directory to crawl the sites for
    def __init__(self, site):
        threading.Thread.__init__(self)
        self.site = site
    
    # run the crawler
    def run(self):
        Crawler.currently_crawled_sites.append(self.site)
        crawlSite(self.site)
        Crawler.lck.acquire()
        Crawler.processes.remove(self)
        if(len(Crawler.processes) == Crawler.maxthreads -1):
            Crawler.evnt.set()
            Crawler.evnt.clear()
        Crawler.lck.release()
    
    # create a new crawler
    def newthread(site):
        Crawler.lck.acquire()
        crwl = Crawler(site)
        Crawler.processes.append(crwl)
        Crawler.lck.release()
        crwl.start()
        
    newthread = staticmethod(newthread)
    
class WebsiteCrawlManager(object):
    '''
        The manager checks the db for new sites and creates new crawl-threads
        once a new site arrives.
    '''
    connect_string = None    
    
    def __init__(self, connect_string):
        self.connect_string = connect_string

    def connect(self):
        '''
            connect to db. initializes the tables
        '''
        global engine
        engine = create_engine(self.connect_string, convert_unicode=True)
        
        metadata = BoundMetaData(engine)
        
        global website_table
        website_table = website_table = Table('websites', metadata,
            Column('id', Integer, primary_key=True),
            Column('url', String(200), nullable=False),
            Column('alpha', Float, nullable=False),
            Column('subgraph', mysql.MSText),
            Column('crawl', Integer, nullable=False, default = 1),
            Column('error-code', String(200), default = ""),
            Column('status', String(200), default = ""),
            Column('time_added', DateTime, default=datetime.datetime.now),
            Column('time_modified', DateTime, default=datetime.datetime.now),
            Column('user_id', Integer)
        )
        
        global classifier
        classifier = Classifier(self.connect_string)
                
    def getNewSites(self):
        '''
            look for new sites in db.
            
            (sites are new if the "crawl" attribute is set to 1
            and they are not part of the currently crawled sites)
        '''
        global website_table
        t = website_table
        if Crawler.maxthreads - len(Crawler.currently_crawled_sites) == 0:
            return []
        
        new_sites = select([t.c.url], t.c.crawl == 1, limit=Crawler.maxthreads).execute()
        new_sites = [site.url for site in new_sites]
        return new_sites

    def start(self):
        self.connect()
        self.run()

    def run(self):
        '''
            run forever checking for new sites and creating new download threads 
            once are found
        '''
        while True:
            new_sites = self.getNewSites()
            new_sites = filter(lambda x: x not in Crawler.currently_crawled_sites, new_sites)
            new_sites = new_sites[:Crawler.maxthreads - len(Crawler.currently_crawled_sites)]
            
            for site in new_sites:
                Crawler.lck.acquire()
                
                # wait when number of crawl threads exeeds limit
                if len(Crawler.processes) >= Crawler.maxthreads:
                    Crawler.lck.release()
                    Crawler.evnt.wait()
                else:
                    Crawler.lck.release()
                # start new crawl thread
                Crawler.newthread(site)
                
            if len(Crawler.currently_crawled_sites) == 0:
                #kill threads      
                for p in Crawler.processes:
                    p.join()
            
            #check every second
            time.sleep(1)