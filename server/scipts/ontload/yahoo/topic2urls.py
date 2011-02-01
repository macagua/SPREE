SEARCH_BASE_WEB = 'http://api.search.yahoo.com/WebSearchService/V1/webSearch'
SEARCH_BASE_NEWS = 'http://search.yahooapis.com/NewsSearchService/V1/newsSearch'

import re;
import urllib;
import httplib2;
http = httplib2.Http()
import simplejson;    

class YahooSearchError(Exception):
    pass


def search(query, context, APP_ID, results=100, start=1, type = "WEB", **kwargs):
#R: A list of URLs contained in a list
#E: Connects to the Yahoo API service to download URLs corresponding to the query and context string
#M: 
#Notes:
#You can optionally specify the number of URLs to get from Yahoo, default set to 100 above.
    
    if type == "WEB":
        kwargs.update({
            'appid': APP_ID,
            'query': query,
            'results': results,
            'start': start,
            'format': 'html',
            'language': 'en',
            'output': 'json',
            'context': context
        })
    
        url = SEARCH_BASE_WEB + '?' + urllib.urlencode(kwargs)
    
    else:
        kwargs.update({
            'appid': APP_ID,
            'query': query,
            'results': 50,
            'start': start,
            'language': 'en',
            'output': 'json',
            'context': context
        })
    
        url = SEARCH_BASE_NEWS + '?' + urllib.urlencode(kwargs)        
    
    result = simplejson.load(urllib.urlopen(url))
    
    if 'Error' in result:
        # An error occurred; raise an exception
        raise YahooSearchError, result['Error']
        
    return result

def SantizeToAlphaNumericOnly(query):
#R: string
#E: Sanitized string version of query
#M: 
#Notes:
#Query strings can cause roblems when passing to Yahoo Web service...sanitize as needed 
#depending on your input queries
    tempstr = query;
    return query.replace('/',' ');

def ProcessInfo(query,info):
#R:
#E: Writes out the URLs to the file named below
#M: Will overwrite file if already exists

    fhurl = open("URLs/"+query+".url","w");
    results = info['Result']
    for result in results:
        fhurl.write(result['Url']+"\n");

if __name__ == "__main__":        
    #Main program starts here    

    
    fh = open('subjects2.txt',"r");
    query = '';
    context = '';
    tabre = re.compile('\t');
    for aLine in fh:
        newLine = tabre.match(aLine);
        if newLine:
            try:    
                if (query != ''): 
                    
                    info =  search(query, context);
                    print 'Mined Yahoo! web search for seed documents related to '+query;
                    ProcessInfo(query,info);
                    query = SantizeToAlphaNumericOnly(aLine.strip());
            except:
                print "Hiccupped on "+query
                context = '';
            else:
                context = context+aLine.strip();
            
    if (query != ''): #Degenerate case of the do-while quirk. fix this 
        info =  search(query, context,20);
        print 'Mined Yahoo! web search for seed documents related to '+query;
        ProcessInfo(query,info);