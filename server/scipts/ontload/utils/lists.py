'''
    convert a list of items to a histogram dictionary of the type {item:count,...}

    @param list: a list of hashable items
    
    @return: a histogram dictionary of the type {item:count,...}
'''
def listToHistogram(list):
    hist = {}
    
    for e in list:
        hist[e] = hist.get(e,0) + 1
        
    return hist