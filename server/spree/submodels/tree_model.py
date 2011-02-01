'''
	Copyright (C) 2008  Deutsche Telekom Laboratories

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
	Date: 22-01-2008
	
'''
'''
    This model provides wrapper classes to the tree related tables (dictionary, ontologynode).
    It also provides methods for the creation and loading of the initial tables from files 
    and for the mapping of text to the term space.
'''

import turbogears
import sqlalchemy.databases.mysql as mysql

from sqlalchemy import *

import cPickle, shelve

from turbogears.database import metadata

from spree.model import User
from spree.spree_model import BlogEntry
from spree.util.text import extractor
from spree.util.matching import normalization, distances
    
tree=None

def makeTreePerm():
    '''
        Makes tree easily and rapidly reachable.
    '''
    
    from spree.submodels.ontologytree_slim import OntologyTree
    
    global tree
    print "Loading tree ...",
    tree = OntologyTree()
    tree.formTree()
    print "done"
    
tree_file = 'spree/data/ontology/nodes.cpkl'
dictionary_file='spree/data/ontology/terms.cpkl'
tree_file_prod = 'spree/data/ontology/nodes_prod.cpkl'
dictionary_file_prod ='spree/data/ontology/terms_prod.cpkl'

def create_tables():
    '''
        Creates the appropriate database tables.
    '''
    
    ontologynode.create(checkfirst=True)
    dictionary.create(checkfirst=True)
    
    # we load the big ontology if in production mode and the smaller one when started in dev mode
    isProd = turbogears.config.get("server.environment") == "production"
    
    #test whether entries exist
    try:
        select([dictionary.c.idf], dictionary.c.term == 'python').execute()
    except:
        print "Reloading the term table ...."
        dictionary.drop()
        dictionary.create()

    #loading ontologynode table
    number_of_rows = ontologynode.count().execute().fetchone()[0]
    # loading is only done if it was not done before
    if number_of_rows==0:
        print "Loading tree ...",
        if isProd:
            load_tree(tree_file_prod)
        else:
            load_tree(tree_file)
        
        print 'done'
        
        print "   Adding indices ...",
        Index('idx_ontologynode_name_dev', ontologynode.c.name).create()
        Index('idx_ontologynode_leftIdx_dev', ontologynode.c.leftIdx, unique=True).create()
        Index('idx_ontologynode_rightIdx_dev', ontologynode.c.rightIdx, unique=True).create()
        Index('idx_ontologynode_level_dev', ontologynode.c.level).create()                           
        print 'done'        
    
    #loading dictionary table
    number_of_rows = dictionary.count().execute().fetchone()[0]
    if number_of_rows==0:
        print "Loading terms ...",
        if isProd:
            load_dict(dictionary_file_prod)
        else:
            load_dict(dictionary_file)
        print 'done'
        
        print "   Adding indices ...",
        Index('idx_dictionary_term_dev', dictionary.c.term, unique=True).create()
        print 'done'
        
# Automatically create the registration tables when TurboGears starts up
turbogears.startup.call_on_startup.append(create_tables)
turbogears.startup.call_on_startup.append(makeTreePerm)

ontologynode = Table('ontologynode', metadata,
    Column('node_id',Integer, primary_key=True),
    Column('name', String(200), nullable=False),
    Column('level',Integer, nullable=False),
    Column('leftIdx', Integer, unique=True, nullable=False),
    Column('rightIdx', Integer, unique=True, nullable=False)
)

dictionary = Table('dictionary',metadata,
    Column('term_id',Integer, primary_key=True),
    Column('term', String(20), unique=True, nullable=False),
    Column('idf', Float, default = 0.0, nullable=False),
    Column('nodes',mysql.MSLongText)
)

class Node(object):
    '''
        Holds the node data.
        Definition is given in ontology node table.
    '''
    
    pass

mapper(Node, ontologynode);

def load_tree(filename):
    '''
        Loads data from cpickle file into ontologynode table.
        
        @param filename: file containing cpickled data
    '''
    
    import bz2

    try:
        # try to load compressed version first
        f=bz2.BZ2File(filename+".bz2", 'r')
    except:
        f=open(filename, 'r')

    table_data=[]
    table_data=cPickle.load(f)
    f.close()
    
    for r in table_data:
        i = ontologynode.insert()
        i.execute(
        {'node_id': r['node_id'], 'name': r['name'], 'level': r['level'],
        'leftIdx': r['leftIdx'], 'rightIdx': r['rightIdx']})
        
    del table_data


def load_dict(filename):
    '''
        Loads data from cpickle file into a dictionary table.
        
        @param filename: file containing cpickled data 
    '''
    
    import bz2
    
    try:
        # try to load compressed version first
        f=bz2.BZ2File(filename+".bz2", 'r')
    except:
        f=open(filename, 'r')

    table_data=[]
    
    table_data=cPickle.load(f)
    f.close()

    print "Loaded terms from file, writing to db ...",
    
    rows = []
    i = dictionary.insert()
    
    while len(table_data) > 0:
        row = table_data.pop()
        rows.append({'term': row['term'], 'nodes': cPickle.dumps(row['nodes']), 'idf':row['idf']})
        if len(rows) > 100:
            print ".",
            i.execute(rows)
            rows = []
        del row
        
    i.execute(rows)    
    del table_data
    del rows
    print


def wordsScore(terms):
    '''
        Calculates score for a given words.
        
        @param terms: list that contains words
        @return: list of node ids of all the nodes where any of the word appeared 
    '''
    
    dict = dictionary.alias('dict')
    sel = select([dict.c.term_id, dict.c.nodes, dict.c.term, dict.c.idf],dict.c.term.in_(*terms.keys())).execute()
    rows=sel.fetchall()
    
    terms2idf = {}
    for row in rows:
        terms2idf[row.term] = row.idf
        
    terms_normalized = normalization.normalizeBow(terms, terms2idf)
    
    selected_nodes = {}
        
    for row in rows:

        nodes = cPickle.loads(row.nodes.encode('latin1'))

        for node_id in nodes.keys():
            if node_id in selected_nodes:
                selected_nodes[node_id] += nodes[node_id] * terms_normalized[row.term]
            else:
                selected_nodes[node_id] = nodes[node_id] * terms_normalized[row.term]

    del rows
    return selected_nodes

def getSubtreeForText(text, alpha = 1000):
    '''
        Extract the terms from a given text and classifies them to a subtree.
        
        @param alfa: factor that regulates branching
        @return: list of nodes contained in a subtree 
    '''
    
    dic = extractor.createDictionaryFromText(text, 10000)
    
    global tree
    subtree = tree.classify(dic, alpha)
    return subtree

def getSubtreeForBow(bow, alpha = 1000):
    '''
        Classifies the bag of words to a subtree.
        
        @param bow: the bag of words
        @param alpha: factor that regulates branching
        @return: a list of node instances representing a subgraph of the tree
    '''
    
    global tree
        
    subtree = tree.classifyToNodes(bow, alpha)
    return subtree

def getLeavesForBow(bow, alpha = 1000):
    '''
        Classifies the bag of words to a subtree, but retain only leave nodes.
        
        @param bow: the bag of words
        @param alpha: factor that regulates branching
        @return: A list of leave node instances the bag of word was classified into
    '''
    
    global tree
        
    subtree = tree.classifyToNodes(bow, alpha)
    subtree = filter(lambda node: node.isLeaf(), subtree)
    return subtree

def getNodeNames(nodeIds):
    '''
        Converts a list of node ids to a list of node names.
        
        @param nodeIds: list of node ids
        @return: list of node names
    '''
    
    global tree
        
    names = [tree.asDict[id].name for id in nodeIds]
    
    return names

def getNodesOnPath(node_id):
    '''
        Given a node id forms a list of the node objects on the path 
        from the given node to the root.
        
        @param node_id: identifying the node
        @return: list of node objects 
    '''
    
    global tree
    
    node = tree.asDict[node_id]
    
    nodes = []
    
    while not node.name == 'root':
        nodes.append(node)
        node = node.parent
        
    return nodes
    
    
def getTree():
    '''
        @return: the tree object
    '''
    
    global tree
    return tree