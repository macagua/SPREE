from __future__ import division
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
    This module provides the Node and OntologyTree classes. Both classes are needed for 
    the classification of questions/experts and the visualization of the knowledge taxonomy.    
'''
import cPickle,time,math

import turbogears
from turbogears.database import metadata, session
import sqlalchemy.databases.mysql as mysql
from sqlalchemy import *

from spree.submodels.tree_model import *

################################################################################

def mean(a):
    '''
        Calculates mean for a list of numbers.
        
        @param a: list of numbers
        @return: mean 
    '''
    
    if len(a) == 0: 
        return 0
    
    return sum(a)/len(a)

def sigma(a):
    '''
        Calculates sigma for a list of numbers.
        
        @param a: list of numbers
        @return: sigma value
    '''
    
    if len(a) == 0: 
       return 0
    
    m=mean(a)
    res=0
    for b in a:
        res+=(b-m)*(b-m)
    res=res/len(a)
    res=math.sqrt(res)

    return res

################################################################################

class Node(object):
    '''
        Inherits definition from ontologynode defined in a tree_model.
    '''
    pass

nodemapper = mapper(Node, ontologynode)


class Node:
    '''
        Definition extension.
    '''

    def __init__(self, row = None):
        '''
            Initializes the node.
            
            @param row: contains fields for node object (database row).
        '''
        self.parent=None
        self.children=[]
        
        if row:
            self.node_id = row.node_id
            self.name = row.name
            self.leftIdx = row.leftIdx
            self.rightIdx = row.rightIdx
            self.level = row.level
            try:
                self.data=cPickle.loads(row.data)
            except:
                self.data = {}
        

    def addChild(self,newChildNode):
        '''
            Adds a new child to node.
            
            @param newChildNode: new child that will be appended to the list of children
        '''
        
        self.children.append(newChildNode)
        newChildNode.parent = self
        
        
    def printNode(self):
        '''
            Prints out some data about the node for check up purposes.
        '''
        print self.name, self.node_id, len(self.children), self.leftIdx, self.rightIdx


    def isLeaf(self):
        '''
            @return: true if node is a leaf
        '''
        
        if self.children==[]:
            return True
        else:
            return False
        
    def isRoot(self):
        '''
            @return: true if node is root
        '''
        
        return self.parent == None
    
    def getBranch(self):
        '''
            @return: branch for a given node (as a list), starting from that node and finishing
            at a level just before root node
        '''
        
        node=self
        branch=[]
        while node and node.name!='root':
            branch.append(node.node_id)
            node=node.parent
        return branch
    
    
    def deleteNode(self):
        '''
            Deletes node.
        '''
        del self.name
        del self.node_id
        del self.level
        del self.leftIdx
        del self.rightIdx
        del self.children
        del self.parent
        
    def getFullPath(self):
        '''
            @return: branch for a given node (as a string), starting from root (i.e. "\\Computers\\Software")
        '''
        
        node = self
        path = ""
        while not node.name=='root':
            path = node.name + "\\" + path 
            node = node.parent
 
        return path[:-1]
    
class OntologyTree(object):
    '''
        Models the hierarchy of knowledge categories.
    '''
    
    def __init__(self):
        '''
            Initializes the tree by adding the root node.
        '''

        self.root = Node()
        self.root.name='root'
        self.root.parent=None
        self.root.children=[]
        self.current=self.root
        self.query_subtree=[]
        self.asDict={}
        
    def formTree(self, table = ontologynode.alias('ont')):
        '''
            Takes data from db and creates tree structure out of it.
            
            @param table: the table that contains all the categories of the tree 
        '''
        
        ont = table
        
        rows = select([ont.c.node_id, 
                      ont.c.name, 
                      ont.c.level,
                      ont.c.leftIdx, 
                      ont.c.rightIdx],
                      order_by=[ont.c.leftIdx]
                  ).execute()
        
        node = Node(rows.fetchone())
        node.name = 'root'
        
        self.root = node
        
        current=node
        
        for row in rows:
            node = Node(row)
            
            while current.rightIdx < node.rightIdx:
                current = current.parent
            
            current.addChild(node)
            current = node
            
        self.addTreeDict(self.root)

    def findNode(self,n_id):
        '''
            Finds node according to it's id.
            
            @param n_id: identifies node
            @return: a node object  
        '''
        
        if self.asDict[n_id]:
            return self.asDict[n_id]
        else:
            return None

    #finding the subtree for a given words
    def choosePath(self,node,sel_nodes,alpha):
        '''
            Finds a subtree. Choses the right path recursively.
            
            @param node: node that is being examined for further branching
            @param sel_nodes: list of selected nodes
            @param alpha: factor that regulates branching
            
        '''
                
        sel_dist={}
        good_group=[]
        
        group=node.children
        
        if len(group)!=0:
            
            for g in group:
                
                if g.node_id in sel_nodes.keys():
                    sel_dist[g.node_id]=sel_nodes[g.node_id]
                else:
                    sel_dist[g.node_id]=0

            m=mean(sel_dist.values())
            s=sigma(sel_dist.values())
            
            for g in group:
                if sel_dist[g.node_id]>(m+alpha*s):
                    good_group.append(g)
                    
            #if none of the nodes has been choosen the one with the max value is picked
            if len(good_group)==0:
                if m > 0:
                    found=max(sel_dist.values())
                    for g in group:
                        if sel_dist[g.node_id]==found:
                            #print 'took the max'
                            good_group.append(g)
                            
            for g in good_group:
                g.distance = sel_dist[g.node_id]

            # best nodes first
            good_group.sort(lambda x, y: cmp(y.distance, x.distance))
                            
            for g in good_group:
                self.query_subtree.append(g)
                self.choosePath(g,sel_nodes,alpha)

    def choosePathPreWeighted(self, node, weighted_nodes, alpha=1000):
        '''
            Uses pre-weighted nodes to find a subgraph of the tree.
            Path is found by following formula: mean + alpha*variance
            
            @param node: Starting point for the path
            @param weighted_nodes: List of nodes weighted by their similarity to the desired bag of words
                                   (which can be a query or a blog etc.)
            @return: A list of node instances representing a subgraph of the tree
        '''
        
        if len(node.children) == 0 or len(weighted_nodes) == 0:
            return []
        
        children = filter(lambda child: child.node_id in weighted_nodes, node.children)
        
        distances = [weighted_nodes[n.node_id] for n in children]
        
        if len(distances) == 0:
            return []
        
        m = mean(distances)
        s = sigma(distances)
        
        threshold = min(m + alpha * s, max(distances))
        
        parentWeight = 0
        if not node.isRoot():
           parentWeight = weighted_nodes[node.node_id]
        
        threshold = max([threshold, parentWeight])
        
        best_children = filter(lambda x: weighted_nodes[x.node_id] >= threshold, children)

        for child in best_children:
            child.distance = weighted_nodes[child.node_id]
            
        result = []
        
        best_children.sort(lambda x, y: cmp(y.distance, x.distance))
                    
        for child in best_children:
            #print child.name, child.distance
            result.append(child)
            result.extend(self.choosePathPreWeighted(child,weighted_nodes,alpha))
            
        return result
    
    def classifyPreWeighted(self, weighted_nodes, alpha):
        '''
            Returns the result of self.choosePathPreWeighted() starting from root
            as a list of node ID's
        '''
        
        path = self.choosePathPreWeighted(self.root,weighted_nodes,alpha)
        return [node.node_id for node in path]        
        
   
    def classify(self,words,alpha=30):
        '''
            Finds a subtree for given words.
            
            @param words: list of words filtered out from the query
            @param alpha: the branching factor
            @return: list of nodes contained in subtree 
        '''
        
        weighted_nodes=wordsScore(words)
        path = self.choosePathPreWeighted(self.root,weighted_nodes,alpha)
        return [node.node_id for node in path]
        
    def classifyToNodes(self,words,alpha=0):
        '''
            Find a subtree for a given bag of words returning node-objects
            
            @param words: The bag of words as a list
            @param aplha: The branching factor
            @return: A list of node instances representing a subgraph of the tree
        '''

        weighted_nodes=wordsScore(words)
        path = self.choosePathPreWeighted(self.root,weighted_nodes,alpha)
        return path
    
    def addTreeDict(self, node = None):
        '''
            Forms a dictionary representation of a tree. ({'node_id':node,...})
            
            @param node: starting node
        '''
        
        if not node:
            node = self.root
        
        for child in node.children:
            self.asDict[child.node_id] = child
            self.addTreeDict(child)
    
    def getFullSubtree(self,list_of_node_ids):
        '''
            Finds full tree for a given list of node ids.
            
            @param list_of_node_ids: list of node ids
            @return: list of node objects contained in a subtree
        '''
        
        fullsubtree = []
        for node_id in list_of_node_ids:
            node=self.findNode(node_id)
            branch=node.getBranch()
            fullsubtree.extend(branch)
            
        fullsubtree = set(fullsubtree)

        return fullsubtree