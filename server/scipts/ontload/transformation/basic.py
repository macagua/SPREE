TFIDF = 1
PROB = 2

import probabilistic, tfidf

'''
    @param nodes2terms: dict of {'node_id':{..<node_data>.., 'bow':{term:term_frequency(term,node_id),...}}}
'''
def transformTermFrequencies(nodes2terms, transformation_type):
    if transformation_type == PROB:
        return probabilistic.transformTermFrequencies(nodes2terms)
    elif transformation_type == TFIDF:
        return tfidf.transformTermFrequencies(nodes2terms)
    else:
        print "Unknown transformation type %d" % transformation_type
        
    