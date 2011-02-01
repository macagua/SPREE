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
    The controller for the profile content
'''
import turbogears
import cPickle, time

import cherrypy

from turbogears.database import session

from turbogears import controllers, expose, validate, redirect
from turbogears import identity

from sqlalchemy import select

from spree.model import User
from spree.submodels import tree_model
from spree.spree_model import Settings
from spree.submodels.website_model import Website

class ProfileController(controllers.Controller, identity.SecureResource):
    '''
        Performs profiling of the user.
    '''

    #filter these filtetypes
    bannedFileTypes = ['.pdf','.swf','.ps','.ppt','.doc','.PDF','.SWF','.PS','.PPT','.DOC','.exe']
        
    # TODO: add fullpath info
    @expose(format="json")
    def getExpertise(self, *args, **kwargs):
        '''
            Serves data about users expertise. 
            
            @return: id and name of field of expertise, level of expertise, 
                and full path from root till that node, as a list and as a string
        '''
        
        if( identity.current.anonymous): 
            return dict(status="No expertise")
        
        user = User.get_by(User.c.user_id==identity.current.user.user_id)
        
        if not user.expertise_subtree:
            return dict(status="No expertise")

        expertise = cPickle.loads(user.expertise.encode('latin1'))
        
        rows =  []
        
        ont_tree=tree_model.getTree()
        
        keys = expertise.keys()
        keys.sort()
        keys.reverse()
        
        for key in keys:
            rows.append({'id':int(key), 'label':ont_tree.asDict[int(key)].name, 
                         'exp':expertise[int(key)],
                         'fullpath':ont_tree.asDict[int(key)].getFullPath(),
                         'branch':ont_tree.asDict[int(key)].getBranch()})

        return dict(rows = rows)
    
    # TODO: validate sent data in tree
    @expose(format="json")
    def setExpertise(self, *args, **kwargs):
        '''
            Sets a users expertise.
            
            @param *args: contains list of node ids
            @param **kwargs: contains node ids and level of expertise for each one of them
            @return: status of user expertise after processing
        '''
        
        expertise = {}
        expertise_subtree={}
        ont_tree=tree_model.getTree()
        
        node_ids=[]
        for arg in kwargs:
            if arg != 'nocache':
                node_ids.append(int(arg))
                expertise[int(arg)]=int(kwargs[arg])
                
        fullsubtree = ont_tree.getFullSubtree(node_ids)

        del ont_tree
        
        for exp in fullsubtree:
            if str(exp) in kwargs:
                expertise_subtree[exp]=int(kwargs[str(exp)])
            else:
                expertise_subtree[exp]=1

        print expertise_subtree
        user = User.get_by(User.c.user_id==identity.current.user.user_id)
        
        user.expertise = cPickle.dumps(expertise)
        user.expertise_subtree = cPickle.dumps(expertise_subtree)
        
        session.update(user)
        session.flush()
        
        if len(expertise) == 0:
            return dict(status="No expertise given.")
        else:
            return dict(status="Changed expertise.")

    @expose(format="json")
    def getNodesInfo(self, *args, **kwargs):
        '''
            Serves information about nodes from the tree.
            
            @param **kwargs: contains list of node ids
            @return: id and name of the node, and full path 
                from root till that node, as a list and as a string
        '''
        
        if not 'nodeids' in kwargs:
            return dict(infos={})
        else:
            nodeids = kwargs['nodeids']
        if not isinstance(nodeids,list):
            nodeids = [nodeids]
        rows = []
        for nid in nodeids:
            node = tree_model.getTree().asDict[int(nid)]
            rows.append({'id':int(nid), 
                         'label':node.name, 
                         'fullpath':node.getFullPath(),
                         'branch':node.getBranch()})
        
        return dict(infos=rows)
    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def loadDocs(self, *args, **kwargs):
        '''
           Loads a list of websites specified by the user and writes them to db.
           
           @param **kwargs: contains websites
           @return: status of processing for each given website
        '''   
        
        try:
            cherrypy.request._no_trans=True 
        except:
            pass
        
             
        if not 'websites' in kwargs:
            return {}        
        
        websites = kwargs['websites']
        
        (status, subgraphs, ongoing) = self.getWebsites(websites)
        
        results = []
        for website in websites:
            if website in status:
                results.append(status[website])
            else:
                results.append("")
        
        return {"status":results, 'finished':len(ongoing)==0}
    
    @expose(format="json", content_type="text/html; charset=UTF-8")
    def extractNodes(self, *args, **kwargs):
        ''' 
            Forms a user profile. ?
            
            @param **kwargs: contains websites and keywords given by the user 
            @return: list of node with constant level of expertise set to 3 and 
                other values needed for the template
        '''
        
        try:
            cherrypy.request._no_trans=True 
        except:
            pass

        rows =  []
        nodes = []
        
        if not 'websites' in kwargs and not 'keywords' in kwargs:
            return dict(rows = rows)

        websites = kwargs.get('websites',[])
        #print "XXX", websites       
        (status, subgraphs, ongoing) = self.getWebsites(websites)
        #print ongoing, subgraphs
        
        ont_tree=tree_model.getTree()
        
        if 'keywords' in kwargs:
            words=kwargs['keywords'].split(",")
            for word in words:
                word = word.strip()
                sub_tree=tree_model.getSubtreeForText(word)
                for node in sub_tree:
                    nodes.append(node)                    
     
        #if not all sites were already crawled and clasified -> wait some seconds
        step = kwargs.get('step',0)
        
        if False and step * 5 < 20 and len(ongoing) > 0:
            time.sleep(5)
            kwargs['step'] = step + 1
            kwargs['nocache'] = int(kwargs.get('nocache',0)) +1
            raise redirect('/profile/extractNodes',kwargs)
            
        for subgraph in subgraphs.values():
            nodes.extend(subgraph)
        
        nodes = list(set(nodes))
        nodes.sort()
        nodes.reverse()
        
        for node_id in nodes:
            rows.append({'id':node_id, 
                         'label':ont_tree.asDict[node_id].name, 
                         'exp':3,
                         'fullpath':ont_tree.asDict[node_id].getFullPath(),
                         'branch':ont_tree.asDict[node_id].getBranch()})        
        
        return dict(rows = rows,status=status,finished=len(ongoing) == 0)
    
    def getWebsites(self, websites):
        '''
            Takes the websites one by one and checks their status. 
            
            @param websites: websites given by the user
            @return: status and classification for each website
        '''
        status = {}
        subgraphs = {}
        new_sites = []
        ongoing_crawls = []
        
        # filter impossible websites
        for website in websites:
            if website == "":
                continue
            
            if len(website) < 4 or website.find(".") == -1:
                status[website] = "No valid url"
                continue            
 
             #check if the filetype is allowed
            for bannedStr in self.bannedFileTypes:
                if website.endswith(bannedStr):
                    status[website] = "Only html supported"
                    break
                
            if not website in status:
                new_sites.append(website)
                status[website] = ""
        
        if len(new_sites) > 0:
            stored_sites = session.query(Website).select(Website.c.url.in_(*new_sites))
            
            for site in stored_sites:
                #sometimes the encoding is different ... so better check
                if site.url in new_sites:
                    new_sites.remove(site.url)
                if site.crawl == 1:
                    ongoing_crawls.append(site.url)
                else:
                    status[site.url] = site.status
                    if site.subgraph:
                        subgraphs[site.url] = cPickle.loads(site.subgraph.encode('latin1'))
        
        # insert new websites
        if len(new_sites) > 0:
            inserts = []
            for site in new_sites:
                print "Adding website ", site
                new_ws = Website()
                new_ws.url = site
                new_ws.alpha = 1.5
                session.save(new_ws)
            session.flush()
       
        return (status, subgraphs, ongoing_crawls)
    
    #TODO: make dynamic if needed
    @expose()
    def getNode(self, *args, **kwargs):
        '''
            ?
            
            @param **kwargs: contains data 
            @return: The tree in json format
        '''
        
        ont_tree=tree_model.getTree()
        
        if 'data' in kwargs:
            import re
            nid = int(re.match('.*?widgetId..(\d+)',kwargs['data']).groups(1)[0])
            node = ont_tree.asDict[nid]
        else:
            node = ont_tree.root
        return self.getChildren(node)
        
    def toDict(self, node):
        '''
            Converts a node and its children to a dict object.
            
            @param node: starting position for conversion 
            @return: dictionary filed with information about nodes from the subtree
        '''
        
        res ={"title": node.name}
        res["nodeId"] = node.node_id
        if len(node.children) > 0:
            children = []
            node.children.sort(cmpNodes)
            res["isFolder"] = True
            for child in node.children:
                children.append(self.toDict(child))          
            res["children"] = children
        return res
    
    def toJSON(self, node):
        '''
            Converts a node and its children to a json object.
            
            @param node: starting position for conversion 
            @return: JSON object filed with information about nodes from the subtree
        '''
        
        res = '{ title:"' + node.name + '"'
        if len(node.children) > 0:
            res = res + ', children:['
            for child in node.children:
                res = res + self.toJSON(child) + ','
            res = res.strip(',')
            res = res + ']'
        res = res + '}'
        return res
    
    def getChildren(self, node):
        '''
             Converts node's children to a string.
             
             @param node: starting position for conversion 
             @return: string filed with information about nodes from the subtree
      ` '''
      
        res = ''
        if len(node.children) > 0:
            res = '['
            node.children.sort(cmpNodes)
            for child in node.children:  
                res = res + '{ "title":"<a onClick=\'nodeClicked(event)\'>' + str(child.name) + '</a>"'
                res = res + ',"widgetId":' + str(int(child.node_id))
                #res = res + ',"objectId":' + str(int(child.node_id))
                res = res + ',"nodeId":' + str(int(child.node_id))
                li = map(int,child.getBranch())
                #li = map(str,li)
                li.append(str(child.getFullPath()))
                res = res + ',"objectId":' + str(li) + ''
                #res = res + ',"fullpath":"' + str(child.getFullPath()) + '"'

                if len(child.children) > 0:
                    res = res + ',"isFolder":true'
                res = res + '},'
            res = res.strip(',')
            res = res + ']'
        return res
    
        
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.preferencesSettings")    
    def getSettingsContent(self, *args, **kwargs):
        '''
            Fetches user settings.
            
            @return: user settings
        '''
        
        user = User.get_by(User.c.user_id==identity.current.user.user_id)
                        
        return{"settings": user.getSettings()}   
   
    # This function accepts a new setting.
    @expose(format="json")
    def update_setting(self, *args, **kwargs):
        '''
            Updates user settings.
            
            @param **kwargs: contains information about anonymity, sending a queries by email and newsletter 
        '''
        
        user = User.get_by(User.c.user_id==identity.current.user.user_id)
        s = user.getSettings()
        
        if kwargs['anonymous'] == "true":
            s.anonymous = 1
            user.display_name = "anonymous";
        else:
            s.anonymous = 0
            user.display_name = user.user_name;
                    
        if kwargs['email'] == "true":
            s.email = 1
        else:
            s.email = 0
            
        if kwargs['newsletter'] == "true":
            s.newsletter = 1
        else:
            s.newsletter = 0
                                  
        session.save(user);
        session.save(s);
        session.flush();
        return dict()

def cmpNodes(node1, node2):
    '''
        Compares two nodes by their name
        
        @param node1: first node
        @param node2: second node
        @return: 0 if true, -1 if false  
    '''
    return cmp(node1.name, node2.name)

