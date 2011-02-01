The ontology

The ontology consists of two tables "ontologytree" and "dictionary". The related data 
is initially stored in the files "nodes.cpkl.bz2" and "terms.cpkl.bz2" for the development version
and "nodes_prod.cpkl.bz2" and "terms_prod.cpkl.bz2" for the productive version. Both data sets
only differ in size with the dev. version containing less categories (around 160) whereas the prod. version
contains the full category tree (around 100 nodes). All data consists of cPickled and compressed python 
dictionary objects.
The "nodes*" dictionary represents the ontology structure and has the following keys:

'node_id': the categories id
'name': the categories label/name
'level': the categories level in the tree structure (root = level 0)
'leftIdx': helper index for faster access
'rightIdx': helper index for faster access

The "terms*" dictionary contains node weights for all terms. The heigher the weight the more we consider
a term to be related to a certain node/category. The initial weights are the term frequncies for a term 
in a given category as found in the training data. These weights were normalized using tfidf and each term
vector was normalized to length 1. The dictionary keys are:

'term': the term/word
'nodes: a dictionary of 'node_id':weight (if a node_id is not part of this dictionary the term did 
		not appear for the node and the weight is thus considered "0")
'idf': the inverse document frequency for this term

To change the systems ontology you simply have to provide your own data set files with the given format.
