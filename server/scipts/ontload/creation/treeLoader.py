import os, cPickle, sys
		
from extraction import extractor
from utils import dictionary as dictutils

class DocLoader(object):
	
	def __init__(self, filterRareTerms):
		self.filterRareTerms = filterRareTerms
	
	def loadDocs(self, base_dir, min_term_number = 3, grams = 3):
		"""
			Loads all documents from a given directory into a bow
			and returns it as a ist of ngrams: [1-gram bow, 2gram bow,... ]
		"""
		nodebow = [{} for n in range(grams)]	
		
		for filename in os.listdir(base_dir):
			if not os.path.isfile(os.path.join(base_dir, filename)):
				continue
			if not filename.endswith('.txt'):
				continue
			
			bow = extractor.file2bow(os.path.join(base_dir, filename), grams)
			if len(bow[0]) < min_term_number:
				continue
			for n in range(len(bow)):
				if len(nodebow)<n+1:
					nodebow.append({})
				dictutils.addDict(nodebow[n],bow[n])

		if self.filterRareTerms:
			for n in range(len(nodebow)):
				nodebow[n] = extractor.filterRareTerms(nodebow[n])
		
		return nodebow
	
class TaxonomyLoader(object):
	
	pklfilename = 'treeload_node_%s.pkl'
	
	def __init__(self, filterRareTerms=False):
		self.id_counter = 0
		self.allnodes = {}
		self.docLoader = DocLoader(filterRareTerms)
		
	def loadTaxonomy(self, base_dir):
		"""
			Starting point for loading the taxonomy structure and the related 
			documents.
		"""
		self.id_counter = 0		
		self.loadNodesFromDirSub(base_dir)
		
	def loadNodesFromDirSub(self, base_dir, count = 0, level=0, doLoadDocs=True):
		"""
			Called from loadNodesFromDir recursivly walks through
			all directories and adds each new directory as a node to the ontology
		"""
		self.id_counter += 1
		
		node = {}		
		node['id'] = self.id_counter
		if count == 0:
			node['name'] = "Root"
			node['node_id'] = node['id']
			node['name_full'] = "Root"
			self.root_dir = base_dir.rstrip('/')
		else:
			node['name_full'] = ''.join(base_dir.split(self.root_dir)[1:])
			foldername = os.path.split(base_dir)[1]#.split('#')
			node['node_id'] = node['id']
			node['name'] =  foldername
		node['level'] = level
		node['leftIdx'] = count
		
		fname = self.pklfilename % node['name']

		if level==1 and os.path.exists('1' + fname):
			doLoadDocs = False
			print 'Skipping loading docs for node', node['name'] 
		
		for file in os.listdir(base_dir):
			path = os.path.join(base_dir, file)	  
			if os.path.isdir(path) and file.find(".svn") == -1:
				count = self.loadNodesFromDirSub(path, count + 1, level +1, doLoadDocs)	
	
		node['rightIdx'] = count +1

  		if doLoadDocs:
		  	bow = self.docLoader.loadDocs(base_dir)
		  	node['bow'] = bow
		  	print base_dir, "Loaded %d terms" % len(bow[0])
		
		if False and level==1:
			if not os.path.exists('1' + fname):
				n = len(node['bow']) #ngram length
				bows = node['bow']
				print 'bows length before modification:', len(bows[0]),len(bows[1]),len(bows[2]), len(bows[0])+len(bows[1])+len(bows[2])
				nodes = []
				for i in range(n):
					nodes.append({node['id']:dict(node)})
					nodes[i][node['id']]['bow'] = bows[i]
					print 'length for n =',i, len(nodes[i][node['id']]['bow'])
				for nid in self.allnodes:
					if self.allnodes[nid]['leftIdx']>node['leftIdx'] and self.allnodes[nid]['rightIdx']<node['rightIdx']:
						#nodes[nid] = self.allnodes[nid]	
						bows = self.allnodes[nid]['bow']
						print 'bows length before modification:', len(bows[0]),len(bows[1]),len(bows[2]), len(bows[0])+len(bows[1])+len(bows[2])
						for i in range(n):
							nodes[i][nid] = dict(self.allnodes[nid])
							nodes[i][nid]['bow'] = bows[i]
							
							#f=open(str(i) + fname,'w')
							#cPickle.dump(nodes[i],f)
							#f.close()
						#print 'length after modification', len(nodes[0][nid]['bow']),len(nodes[1][nid]['bow']),len(nodes[2][nid]['bow'])
				#sys.exit(1)
				del bows
				del nodes
				self.allnodes = {}
			else:
				pass
				#print 'Loading node /%s from cpickle file.' % node['name']
				#f=open(fname,'r')
				#node = cPickle.load(f)
				#f.close()
		
		self.allnodes[node['id']] = node
		
		return count + 1
	
if __name__=='__main__':
	print 'Usage: treeLoader.py base_dir'
	if len(sys.argv)>1:
		base_dir = sys.argv[1]
		tl = TaxonomyLoader()
		tl.loadTaxonomy(base_dir)
		print 'Loaded %i nodes' % len(tl.allnodes)

		#for nid in tl.allnodes:
		#	print nid, tl.allnodes[nid]['name'], tl.allnodes[nid]['name_full'], tl.allnodes[nid]['level'], len(tl.allnodes[nid]['bow'])
		#	print tl.allnodes[nid]['leftidx'], tl.allnodes[nid]['rightidx'] 
