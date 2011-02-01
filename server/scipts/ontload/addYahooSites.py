import os, cPickle
from yahoo import topic2urls

import settings

file_out_urls = settings.yahoo.filename_url
file_out_query = settings.yahoo.filename_query
file_out_result = settings.yahoo.filename_result

n_results_max = settings.yahoo.n_results_max
n_results_per_query = settings.yahoo.n_results_per_query
APP_ID = settings.yahoo.app_id
additional_query_string = ""
context = ""

counter = 0

def addSiteLinks(base_dir):
    pass

def writeUrlsToDir(dir, urls):
    file = open(os.path.join(dir, file_out_urls),'w')
    
    for url in urls:
        file.write(url)
        file.write("\n")
    
    file.close()
    
def writeQueryToDir(dir, query):
    file = open(os.path.join(dir, file_out_query),'w')

    file.write(query)
    file.write("\n")
    
    file.close()
    
def writeResultsToDir(dir, results):
    file = open(os.path.join(dir, file_out_result), 'w')
    cPickle.dump(results, file)    
    file.close()
    
def getUrlsForNode(parent_names, include_parent=settings.yahoo.include_parent_in_querystring):
    global counter
    
    query_string = ""
    
    words = []
    
    min_id = len(parent_names) - 1
    if include_parent:
        min_id = min_id - 1
    
    print 
    
    for parent in parent_names[min_id:]:
        words.append(parent)
    
    for word in words:
        query_string += " %s " %(word)
            
    query_string += additional_query_string
    counter += 1
    print counter," Query:",query_string
    
    #try:
    results = []
    max_tries = 4
    tries = 0
    while len(results) < n_results_max and tries < max_tries:
        new_results = topic2urls.search(query_string, context, APP_ID, n_results_per_query, len(results))
        max_results = int(new_results['ResultSet']['totalResultsAvailable'])
        if int(new_results['ResultSet']['totalResultsAvailable']) < 10000:
            print "XXX This query only returned very few results !!!", new_results['ResultSet']['totalResultsAvailable']
            print new_results
        results.extend(new_results['ResultSet']['Result'])
        tries +=1
    #except:
    #    print "Could not retrieve results."
    #    return (query_string,[],None)

    print "Obtained %d / %d results." % (len(results),max_results)
    urls = []
    
    for result in results:
        urlstring = result['Url']        
        urls.append(urlstring)
        
    return (query_string, urls, results)

def addSiteLinksToDir(dir, parent_names = [] ):

    # add you site links
    for file in os.listdir(dir):
        path = os.path.join(dir, file)
        if os.path.isdir(path):
            parent_names.append(file)
            addSiteLinksToDir(path, parent_names)
            
            if (os.path.isfile(os.path.join(path,file_out_urls))):
                if settings.yahoo.skip_existing and os.path.getsize(os.path.join(path,file_out_urls)) > 0:
                    parent_names.pop()
                    continue    

            (query_string, urls, results) = getUrlsForNode(parent_names)
            writeUrlsToDir(path, urls)
            writeQueryToDir(path, query_string)
            writeResultsToDir(path, results)
            print "Writing %d urls for %s" % (len(urls), path)
            parent_names.pop()

def usage():
    print "Usage: python addYahooSites <dir>"
    
if __name__ == "__main__":
    import sys    
    
    args = sys.argv[1:]
    
    if len(args) != 1:
        print "Wrong number of arguments."
        usage();
        sys.exit(2)
        
    addSiteLinksToDir(args[0])  
            
