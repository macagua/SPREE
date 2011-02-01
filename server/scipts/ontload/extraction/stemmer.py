import re

from nltk_lite.stem.porter import Porter

stemmer = Porter() 

def stemDict(counted_dict):
    """
        Use stemming for the given terms.
        Words that result into the same word after stemming are unified.
    """    
    clean_dict=dict()
    for key in counted_dict:
        stemmed_key = stem(key)
        
        if stemmed_key in clean_dict:
            clean_dict[stemmed_key] += int(counted_dict[key])
        else:
            clean_dict[stemmed_key] = int(counted_dict[key])
        
    return clean_dict

def stem(term):
    if re.search('\d',term):
        return term    
    else:
        return stemmer.stem(term)