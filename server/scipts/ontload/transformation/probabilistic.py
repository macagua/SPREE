from __future__ import division

import math

LAPLACE = 1

'''
    @param nodes2terms: dict of {'node_id':{..<node_data>.., 'bow':{term:term_frequency(term,node_id),...}}}
'''
def transformTermFrequencies(nodes2term, smoothing_type = LAPLACE, eps = 0.2, isLog = True):
    
    if smoothing_type == LAPLACE:
        all_terms = set()
        for node_id, data in nodes2term.items():
            all_terms = all_terms.union(data['bow'].keys())
        
        for node_id, data in nodes2term.items():
            sum_ = sum(data['bow'].values())
            virtual_length = sum_ + eps * len(all_terms)
        
            #all zero terms will get this weight
            data['bow']['nb_zero_term'] = 0
            bow = data['bow']
            
            for term, tf in bow.items():
                if isLog:
                    bow[term] = math.log((tf+eps)/virtual_length)
                else:
                    bow[term] = (tf+eps)/virtual_length
        
    return nodes2term
                    