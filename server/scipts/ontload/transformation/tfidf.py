from __future__ import division

import math

'''
    @param nodes2terms: dict of {'node_id':{..<node_data>.., 'bow':{term:term_frequency(term,node_id),...}}}
'''
def transformTermFrequencies(nodes2term, n=0):
    
    df = {}
    for node_id, data in nodes2term.items():
        if len(data['bow']) == 0:
            continue
        for term in data['bow'][n].keys():
            df[term] = df.get(term,0) + 1
            
    for node_id, data in nodes2term.items():
        if len(data['bow']) == 0:
            continue
        bow = data['bow'][n]

        for term, tf in bow.items():    
            bow[term] = (math.log(tf) + 1) / df[term]
        
        length = math.sqrt(sum(map(lambda x: x*x, bow.values())))
        
        for term, tf in bow.items():    
             bow[term] = tf / length
             
    df = None

    return nodes2term

#n2t = {'n1':{'bow':{'a1':1,'a2':1}},'n2':{'bow':{'a1':3,'a4':4}}}
#print transformTermFrequencies(n2t)   