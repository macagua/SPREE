import cPickle, bz2, sys, os

sys.path.append(os.getcwd())

from creation import treeLoader
from transformation import basic as transf
from utils import matrix

filename_exp_nodes = "nodes.cpkl"
filename_exp_terms = "terms.cpkl"

'''
	@param nodes: a list of node_id: {'node_id':...,'name': ...,'leftIdx':...,'rightIdx':...,'level':...}
'''
def exportNodes2cPickle(nodes, suffix=''):
	print "Exporting nodes ...",
	   
	dumpToFile([v for v in nodes.values()], filename_exp_nodes, True)
	
	print "done"

'''
	@param terms: a list of term: {'term':...,'idf':...,'nodes':{node_id: term_weight(term,node_id),...}}
'''
def exportTerms2cPickle(terms, suffix=''):
	print "Exporting terms ...",
   
	dumpToFile(terms, filename_exp_terms, True)
	
	print "done"
	
def dumpToFile(object, filename, compress=False):
	if compress:
		f = bz2.BZ2File(filename+".bz2", 'wb')
	else:
		f=open(filename, 'wb')
	cPickle.dump(object, f)
	f.close()
	
def exportTree2cPickle(nodes, terms, suffix=''):
	exportNodes2cPickle(nodes, suffix)
	del nodes
	exportTerms2cPickle(terms, suffix)
	
if __name__=='__main__':
	print 'Usage: exportTree.py <base_dir>'
	print 'base_dir - the root directory of the tree'
	
	if len(sys.argv)>1:
		base_dir = sys.argv[1]
		
		tl = treeLoader.TaxonomyLoader(filterRareTerms=False)
		tl.loadTaxonomy(base_dir)
		allnodes = transf.transformTermFrequencies(tl.allnodes, transf.TFIDF)
	
		alldata = {}
		for k, item in allnodes.items():
			if len(item['bow']) == 0:
				alldata[k] = {}
			else:
				alldata[k] = item['bow'][0]
				#print k, alldata[k]
			item['bow'] = {}
			
		allterms = matrix.transposeDictMatrix(alldata)
		node_output = allnodes
		term_output = [{'term':term,'nodes':nodeweights,'idf':1} for term, nodeweights in allterms.items() if len(term) < 20]		
		#print allterms
		exportTree2cPickle(node_output,term_output)
		