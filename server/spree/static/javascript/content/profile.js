/*
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
	
*/

/**
 * Objects and functions for profile. Initialization starts with initProfile()
 */


// Object for managing the expertise field list
var ftable = new FieldTable();
var treeClickX=0;
var treeClickY=0;

/**
 * Object for managing the profile tree
 */
var TreeBuilder = {
	/**
	 * The Array containing the nodes
	 */
	treeDat : {
	  treeNodes: []
	},
	/**
	 * Callback function which initializes treeDat
	 * 
	 * @param {Object} result json result object from /profile/getNode
	 */
	loadNodes:function(result){
		TreeBuilder.treeDat.treeNodes = result;
	},
	/**
	 * Builds all tree nodes starting from treeParentNode with the 
	 * data given through dataObjs
	 * 
	 * @param {Object} dataObjs Object returned from server used to build the nodes
	 * @param {Object} treeParentNode The node where node building is started
	 */
	buildTreeNodes:function (dataObjs, treeParentNode){
		for(var i=0; i < dataObjs.length;i++){
			var node = dojo.widget.byId('' + dataObjs[i].nodeId);

			if(node && BrowserDetector.browser == "Explorer"){
				treeParentNode.removeChild(node);
				dojo.widget.manager.removeById('' + dataObjs[i].nodeId);
			}
			node =  dojo.widget.createWidget("TreeNode",{
				title:dataObjs[i].title,
				widgetId:dataObjs[i].nodeId,
				objectId:dataObjs[i].objectId,isFolder:dataObjs[i].isFolder
			});
			treeParentNode.addChild(node);
			if(dataObjs[i].children){
     			TreeBuilder.buildTreeNodes(dataObjs[i].children, node);
	    	}
		}
	},
	/**
	 * Builds the needed widgets populates the tree and adds it to the page
	 */
	buildTree:function (){
		var treeSelector = dojo.widget.createWidget("TreeSelector",{
			widgetId:"myTreeSelector"
		});
		var myTreeWidget = dojo.widget.createWidget("Tree",{
			widgetId:"myTreeWidget",
			selector:"myTreeSelector"
		});
		
		dojo.event.topic.subscribe(treeSelector.eventNames.select,nodeSelected);
		dojo.event.topic.subscribe(treeSelector.eventNames.dblselect,nodeSelected);
		TreeBuilder.buildTreeNodes(TreeBuilder.treeDat.treeNodes,myTreeWidget);
		TreeBuilder.replacePlaceHolder(myTreeWidget);
				
	},
	/**
	 * Replaces the tree placeholder with the given widget
	 * 
	 * @param {Object} myTreeWidget The tree widget object
	 */
	replacePlaceHolder:function (myTreeWidget){
		var treeContainer = getElement("myWidgetContainer");
		var placeHolder = getElement("treePlaceHolder");
		treeContainer.replaceChild(myTreeWidget.domNode,placeHolder);
	},
	/**
	 * Saving the tree by copying it to the body and set display to none
	 */
	saveTree:function(){
		TreeBuilder.markListUnselectedAllNodes();
		TreeBuilder.unselectAllNodes();
		var treeCont = getElement("myWidgetContainer");
		if(treeCont){
			dojo.body().appendChild(treeCont);
			treeCont.style.display = 'None';
		}
	},
	/**
	 * Loads the tree from the body and makes it visible
	 */
	loadTree:function(){
		var treeConts = getElementsByTagAndClassName("div",'treeWidget',dojo.body());
		var phs = getElementsByTagAndClassName("span",'placeholder',treeConts[0]);
		if(phs.length > 0){
			var treeContEmpty = treeConts[0];
			var treeContBody = treeConts[1];
		}else{
			var treeContEmpty = treeConts[1];
			var treeContBody = treeConts[0];
		}

		treeContEmpty.parentNode.replaceChild(treeContBody,treeContEmpty);
		treeContBody.style.display = 'block';
	},
	/**
	 * Marks a node when it is also a member of the expertise list
	 * 
	 * @param {int} nodeid Identifies the node
	 */
	markListSelected:function(nodeid){
		var node = dojo.widget.byId(nodeid + '');
		if(node){
			node = node.domNode;
			var a = MochiKit.DOM.getFirstElementByTagAndClassName('a',null,node);
			dojo.html.addClass(a,'treeSelectedItem');
		}/*else{
			alert('Node not found!');
		}*/
	},
	/**
	 * Unmarks a node when it is not a member of the expertise list
	 * 
	 * @param {Object} nodeid Identifies the node
	 */
	markListUnselected:function(nodeid){
		var node = dojo.widget.byId(nodeid + '');
		if(node){
			node = dojo.widget.byId(nodeid + '').domNode;
			var a = MochiKit.DOM.getFirstElementByTagAndClassName('a',null,node);
			dojo.html.removeClass(a,'treeSelectedItem');
		}/*else{
			alert('Node not found!');
		}*/
	},
	/**
	 * Unmarks all nodes
	 */
	markListUnselectedAllNodes:function(){
		var wcont = getElement("myWidgetContainer");
		var selectedNodes = getElementsByTagAndClassName('a','treeSelectedItem',wcont);
		for(var i=0;i<selectedNodes.length;i++){
			dojo.html.removeClass(selectedNodes[i], 'treeSelectedItem');
		}
	},
	/**
	 * Unselects all nodes(selected means they where clicked)
	 */
	unselectAllNodes:function(){
		var wcont = getElement("myWidgetContainer");
		var selectedNodes = getElementsByTagAndClassName('span','dojoTreeNodeLabelSelected',wcont);
		for(var i=0;i<selectedNodes.length;i++){
			dojo.html.removeClass(selectedNodes[i], 'dojoTreeNodeLabelSelected');
		}
	}
}

/**
 * Class for managing the list of fields of expertise which in fact is a table
 */
function FieldTable() {
	
	/**
	 * Rating bar and rating popups are hidden when set to true
	 */
	this.hideRating = false;
	/**
	 * Holds the list items. The structure is:
	 * data[i].exp		-	The expertise value
	 * data[i].label	-	The node label
	 * data[i].id		-	The node id
	 * data[i].fullpath	- 	The path to root 
	 * data[i].branch	-	A list of all parent node ids(till root)
	 */
	this.data = [];
	/**
	 * Creates the widget and populates the list with the data
	 * 
	 * @param {Object} result JSON call result object from /profile/getExpertise
	 */
	this.buildTable = function(result){
		var list = dojo.widget.createWidget("FilteringTable",{
			widgetId:"expertFieldsTable",
			headClass:"fixedHeader",
			tbodyClass:"scrollContent",
			enableMultipleSelect:"false"
			},
			dojo.byId("myExpertiseFields")
		);
		
		ftable.fillDataFromJson(result);
		
		ftable.populateData();
	};
	/**
	 * Replaces the html table with the widget table
	 * 
	 * @param {Object} myFieldTable The expertise fields widget table
	 */
	this.replacePlaceHolder = function (myFieldTable){
		var listContainer = getElement("scrolllist");
		var placeHolder = getElement("myExpertiseFields");
		listContainer.replaceChild(myFieldTable.domNode,placeHolder);
	};
	/**
	 * Adds a row to the table containing the rating bar and the
	 * node specific information. If the node is already listed
	 * the rating is updated. The data array is NOT modified by this method!
	 * 
	 * @param {Object} title Title of the node
	 * @param {Object} nodeid ID of the node
	 * @param {Object} rating Rating of the node
	 */
	this.addEntry = function (title,nodeid,rating){
 		//add an entry for the selected tree node to the table
		var w=dojo.widget.byId('expertFieldsTable');
		var cellInList = this.getListCell(nodeid,w);
		// do we already have an entry for this node?
		if(cellInList != null){
			setRatingHTML(cellInList,rating);
			var bars = getElementsByTagAndClassName("DIV",null,cellInList);	
			markBars(bars,rating);
			return;		
		}
		TreeBuilder.markListSelected(nodeid);

		fullTitle = ftable.getFullPath(nodeid);
		title = fullTitle;
		if(title.length>33){
			title = title.substr(title.length-33,33);
			title = "..." + title;
		}

		var tbody;
		var tbodies = w.domNode.getElementsByTagName("tbody");

		if ( tbodies.length > 0 ){ 
			tbody = w.domNode.getElementsByTagName("tbody")[0];
		}
		else{
			tbody = document.createElement("tbody");
			tbody.setAttribute("class","scrollContent");
			w.domNode.appendChild(tbody);
		}
		 var row=document.createElement("tr");
		 dojo.event.connect(row, "onclick", "expRowSelected");
		 var cell=document.createElement("td");
		 cell.setAttribute("align","left");

		 
		 cell.title = fullTitle;
		 cell.innerHTML= '<a title="' + fullTitle + '">' + title + '</a>';
		 //add the rating bar
		 var rateBar = getElement("ratingBar");
		 cell.innerHTML+=rateBar.innerHTML;
		 row.appendChild(cell);
		 tbody.appendChild(row);

		 var bars = getElementsByTagAndClassName("DIV",null,tbody.lastChild);
		 if(ftable.hideRating){
			for(var i=0;i<5;i++){
				bars[i].style.display = "None";
			}
			var lbl = getElementsByTagAndClassName("span","ratingBarTitle",tbody.lastChild);
			lbl[0].style.display = "None";
		 }
		 markBars(bars,rating);
		 var td = bars[1].parentNode.parentNode; 
		 td.setAttribute("nodeid",nodeid);
		 setRatingHTML(td,rating);
	};
	/**
	 * Returns the table cell belonging to the given node id. If the node is not
	 * listed null is returned. 
	 * 
	 * @param {Object} nodeid The node ID
	 * @param {Object} list The table holding all expertise fields
	 */
	this.getListCell= function (nodeid, list){
		if(list.domNode.tBodies.length<1) return null;
		var rows = list.domNode.tBodies[0].rows;
		for(var i=0; i<rows.length; i++){
			if(nodeid == rows[i].cells[0].getAttribute('nodeid')){
				return rows[i].cells[0];
			}
		}
		return null;
	};
	/**
	 * Returns the index of the data array of the given node id.
	 * If the array does not contain the given node -1 is returned.
	 * 
	 * @param {Object} nodeid The node ID
	 */
	this.getDataIndex = function(nodeid){
		for(var i=0; i<ftable.data.length; i++){
			if( ftable.data[i].id == nodeid ){
				return i;
			}
		}
		return -1;
	};
	/**
	 * Removes the node identified through the given click event
	 * from both the html table and the data array.
	 * 
	 * @param {Object} evt Click event
	 */
	this.removeRating = function (evt){
		var current = (evt.target) ? evt.target : evt.srcElement;
		var row = current.parentNode.parentNode;
		var nodeid = current.parentNode.getAttribute("nodeid");
		row.parentNode.removeChild(row);
		ftable.data.splice(ftable.getDataIndex(nodeid),1);
		TreeBuilder.markListUnselected(nodeid);
	};
	/**
	 * Updates the rating value in the data array for the given node.
	 * Returns true or false depending on the success of the method.
	 * 
	 * @param {Object} nodeid The node ID
	 * @param {Object} rating The rating to be set
	 */
	this.updateExpertise = function(nodeid,rating){
		var idx = ftable.getDataIndex(nodeid);
		if(idx<0){
			return false;
		}
		ftable.data[idx].exp = rating;
		return true;
	};
	/**
	 * Populates the list with the data from the array
	 */
	this.populateData = function(){
		for(var i=0; i<ftable.data.length; i++){
			var entry = ftable.data[i];
			ftable.addEntry(entry.label,entry.id,entry.exp);
		}
	};
	/**
	 * Setter for ftable.data
	 * 
	 * @param {Object} newData The new data
	 */
	this.setData = function(newData){
		ftable.data = newData;
	};
	/**
	 * Fills the list data with the result received through a Json call
	 * 
	 * @param {Object} result JSON result object from /profile/getExpertise
	 */
	this.fillDataFromJson = function(result){
		if(result && (!result.status || result.status != 'No expertise')){
			ftable.data = result.rows;
		}
	};
	/**
	 * Sets the headline for Expertise field list
	 * @param {Object} text The new headline
	 */
	this.setListHeader = function(text){
		var listContainer = getElement('expertFields');
		var listHeader = getElementsByTagAndClassName(null,'tablehead',listContainer)[0];
		listHeader.innerHTML = text;
	};
	/**
	 * Get full path of a certain node. Information can be found either 
	 * in ftable.data[i].fullpath or dojo.widget.byId(nodeid + '').objectId.
	 * 
	 * @param {Object} nodeid The node ID
	 */
	this.getFullPath = function(nodeid){
		
		for(var i = 0; i<ftable.data.length; i++){
			if(ftable.data[i].id == nodeid && ftable.data[i].fullpath){
				return ftable.data[i].fullpath;
			}
		}
		
		infos = dojo.widget.byId(nodeid + '').objectId;
		fullTitle = infos[infos.length-1] ;
		return fullTitle;
	};
	/**
	 * Get full path of a certain node. Information can be found either 
	 * in ftable.data[i].fullpath or dojo.widget.byId(nodeid + '').objectId.
	 * 
	 * @param {Object} nodeid The node ID
	 */
	this.getBranch = function(nodeid){
		for(var i = 0; i<ftable.data.length; i++){
			if(ftable.data[i].id == nodeid && ftable.data[i].branch)
				return ftable.data[i].branch;
		}
		
		infos = dojo.widget.byId(nodeid + '').objectId;
		branch = infos.slice(0,-1) ;
		return branch;
	}
}

/**
 * Init function for the profile tree.
 * @param cats - Optional initial categories can be passed, which will appear
 * 				 as selected. No further calls to retrieve rated categories
 * 				 are performed when specified.
 */
function initProfile(cats,result){
	if( !result ){ 
		result = cats;
		cats = null;
	}else{
		newar = [];
		for(var j = 0; j<cats.length; j++){
			newar.push(cats[j]);
		}
		cats = newar;
	}
	var myTreeWidget = dojo.widget.manager.getWidgetById('myTreeWidget');
	// do we already have the widget?
	if( myTreeWidget ){
		
		TreeBuilder.loadTree();
		initFieldsTable(cats);
	}else{
		var url = tgurl + "/profile/getNode"; 
		var d = loadJSONDoc(url,{"nocache": (new Date()).getTime()});
		d.addCallback(TreeBuilder.loadNodes);
		d.addCallback(TreeBuilder.buildTree);
		d.addCallback(function(){				var myRpcController = dojo.widget.createWidget("TreeRPCController",{
			       	widgetId:"treeController",
			       	RPCUrl:url
			     });
			   	myRpcController.onTreeClick = function(message){
			     	var node = message.source;
			     if (node.isExpanded){
			       	this.expand(node);
			     } else {
			       	this.collapse(node);
			     }
				 setTimeout("markChildren(" + node.widgetId + ")",400);
				 
			   	};
				
			   	var treeContainer = document.getElementById("myWidgetContainer");
				treeContainer.appendChild(myRpcController.domNode);
			   	myRpcController.listenTree(dojo.widget.manager.getWidgetById("myTreeWidget"));
		});
		d.addCallback(initFieldsTable,cats);
	}
}

/**
 * Init function for the expertise fields list.
 * @param cats - Optional initial categories can be passed, which will appear
 * 				 as selected. No further calls to retrieve rated categories
 * 				 are performed when specified.
 */
function initFieldsTable(cats,result){
	var list = dojo.widget.byId('expertFieldsTable');
	//var url = "/profile/getExpertise"; 
	if(cats){
		ftable.setData(cats);
	}
	if( list ){
		if(cats){
			MochiKit.DOM.replaceChildNodes(list.domNode);
			ftable.populateData();
			ftable.replacePlaceHolder(list);
		}else{
			//var d = loadJSONDoc(url,{"nocache": (new Date()).getTime()});
			var d = callManager.doRequest("profile","getExpertise", null, null);
			if(d)
			d.addCallback(function(res){
				ftable.fillDataFromJson(res);
				MochiKit.DOM.replaceChildNodes(list.domNode);
				ftable.populateData();
				ftable.replacePlaceHolder(list);
			});
		}
	}else{
		if(cats){
			ftable.buildTable();		
		}else{
			//var d = loadJSONDoc(url,{"nocache": (new Date()).getTime()});
			var d = callManager.doRequest("profile","getExpertise", null, null);
			d.addCallback(ftable.buildTable);
		}
	}
	
}

/**
 * Needed for workaround for scrolling in IE
 */
var inith = -1;

var branch2Expand;

/**
 * Marks all children of the specified node
 * 
 * @param {Object} nodeid The (parent) node ID
 */
function markChildren(nodeid){
	var node = dojo.widget.byId(nodeid + '');
	for(var j=0; j<node.children.length; j++){
			var child = node.children[j];
			if(ftable.getDataIndex(child.widgetId)>-1){
				TreeBuilder.markListSelected(child.widgetId);
			}	
	}
}

/**
 * Expands all nodes listed in branch2Expand recursively
 * 
 * @param {Object} idx The Array index specifying which node in branch2Expand is to be expanded
 */
function expandTree(idx){
	var branch = branch2Expand;
	node = dojo.widget.byId(branch[(+idx)] + '');
	if(node && node.lockLevel<1){
		markChildren(node.parent.widgetId + '');
		if(node.isFolder)
			dojo.widget.byId('treeController').expandToLevel(node,1);
		if(idx>0){
			window.setTimeout("expandTree(" + (idx-1) +")",200);
		}else{
			window.setTimeout("scrollToNode(" + node.widgetId +")",200);
		}
	}else{
		window.setTimeout("expandTree(" + (idx) +")",200);
	}
}

/**
 * Scrolls the tree to the given node
 * 
 * @param {Object} nodeid The node ID
 */
function scrollToNode(nodeid){
	var node = dojo.widget.byId(nodeid + '');
	if(node.lockLevel>0){ 
		window.setTimeout("scrollToNode(" + nodeid +")",200);
		return;
	}
	
	var wcont = getElement("myWidgetContainer");
	wcont = MochiKit.DOM.getFirstElementByTagAndClassName('div','dojoTree',wcont);
	if(BrowserDetector.browser == "Explorer"){//IE 
		if(inith<0) inith=wcont.scrollHeight;
	}else{//FF
		inith = wcont.scrollHeight;
	}
	inith=wcont.scrollHeight;

	posCont = MochiKit.Style.getElementPosition(wcont);
	posNode = MochiKit.Style.getElementPosition(node.domNode);
	pny = posNode.y
	if(BrowserDetector.browser == "Explorer")
		pny = posNode.y + wcont.scrollTop;

	posYRel = pny + wcont.scrollTop - posCont.y;
	
	wcont.scrollTop = posYRel-70;
		
	/* Mark the clicked node as selected in the tree and unmark the rest*/
	TreeBuilder.unselectAllNodes();
	node.markSelected();
}

/**
 * Called when a row is selected in the expertise list
 * @param {Object} evt HTMLEvent
 */
function expRowSelected(evt){
	var current;
	
	if(evt.target){//FF 
		current = evt.target;
	}else{//IE
		current = evt.srcElement;
	}
	if(current.nodeName == 'TR'){
		current = current.childNodes[0];
	}
	while(current.nodeName != 'TD'){
		current = current.parentNode;
	}
	var nodeid = current.getAttribute('nodeid');

	var branch = ftable.getBranch(nodeid);
	branch2Expand = branch;
	
	window.setTimeout("expandTree(" + (branch.length-1) + ")",200);
	return;
	
}

/**
 * Called through the dojo event system when a tree node is clicked. 
 * Opens a popup window where the user can specify his expertise value. 
 * Note that two event methods are needed(see nodeClicked() below)
 * because the javascript click event is fired before the node
 * is selected so there is no possibility to determine the selected node.
 */
function nodeSelected() {
    var treeSelector = dojo.widget.manager.getWidgetById('myTreeSelector');
    var node = treeSelector.selectedNode;
	if(ftable.hideRating){
		var title = node.title.replace(/<.*?>/,"").replace(/<.*?>/,"");
		var rating = 0;
		if( !ftable.updateExpertise(node.widgetId,rating) ){
			ftable.data.push({id:node.widgetId,
						exp:rating,
						label:title
						});
		}
    	ftable.addEntry(title,node.widgetId,rating);
		//Scroll to bottom
		 var slist = getElement("scrolllist");
		 slist.scrollTop = slist.scrollHeight;
		return;
	}
	
	popupRateShow();
	
	var lbl = getElement("ratepopuplabel");
	lbl.innerHTML = "<b>" + node.title + "</b>";	
	var bar = getElement("popupRatingBar");
	var idx = ftable.getDataIndex(node.widgetId);
	var initrate = 0;
	if( idx > -1 ) initrate = ftable.data[idx].exp;
	markBars(getElementsByTagAndClassName("DIV",null,bar),initrate);
	setRatingHTML(bar,initrate);
	var inp1 = getElement("ratePopupTitle");
	inp1.value = node.title.replace(/<.*?>/,"").replace(/<.*?>/,"");
	var inp2 = getElement("ratePopupObjectId");
	inp2.value=node.widgetId;
}

/**
 * Called when a tree node is clicked. This second event handler is needed
 * because dojo does not forward the click event but we need the 
 * mouse pointer coordinates.
 * 
 * @param {Object} evt HTML click event
 */
function nodeClicked(evt){
	TreeBuilder.unselectAllNodes();
	if(evt.pageX){
		treeClickX=evt.pageX;
		treeClickY=evt.pageY;
	}
	else {
		treeClickX=evt.clientX;
		treeClickY=evt.clientY;
	}
}

/**
 * Displays the rating popup
 */
function popupRateShow(){
	var md = new dojo.widget.Dialog();
	md.followScroll = false;
	md.showModalDialog();
	var popup = getElement("ratePopup");
	dojo.html.placeOnScreen(popup,treeClickX,treeClickY);
	MochiKit.Visual.appear(popup,{duration:0.1});
}

/**
 * Called when the user clicks OK in the popup window.
 * Adds/Updates the list and the data array.
 */
function popupRateOk(){
	var popupbar = getElement("popupRatingBar");
	var rating = getRatingHTML(popupbar);
	//var inp1 = getElement("ratePopupTitle");
	//var title = inp1.value;
	var inp2 = getElement("ratePopupObjectId");
	var nid = inp2.value;
	var title = ftable.getFullPath(nid);
	if( !ftable.updateExpertise(nid,rating) ){
		ftable.data.push({id:nid,
					exp:rating,
					label:title,
					fullpath:title,
					branch:ftable.getBranch(nid)
					});
	}
    ftable.addEntry(title,nid,rating);
	//Scroll to bottom
	 var slist = getElement("scrolllist");
	 slist.scrollTop = slist.scrollHeight;
	popupRateCancel();
}

/**
 * Called when the user clicks Cancel in the popup window.
 * Closes the popup window.
 */
function popupRateCancel(){
	var popup = getElement("ratePopup");
	MochiKit.Visual.fade(popup,{duration:0.1});
	var md = new dojo.widget.Dialog();
	if(md.shared.bg != null){
		md.hideModalDialog();
	}
}

/**
 * Mouseover effect for the rating bar
 * @param {Object} evt HTML event object
 * @param {Object} no Specifies the rating bar element
 */
function highlightBar(evt, no){
	//IE uses .srcElement, FF .target
	var current = (evt.target) ? evt.target : evt.srcElement;
	var bars = getElementsByTagAndClassName("DIV",null,current.parentNode.parentNode);
	for(i=1;i<6;i++){
		var bar = bars[i-1];
		if(i==no){
			bar.style.borderColor='gray';
		}else{
			bar.style.borderColor='#000';
		}
	}
}

/**
 * Mouseout effect for the rating bar
 * @param {Object} evt HTML event object
 * @param {Object} no Specifies the rating bar element
 */
function delightBar(evt, no){
	//IE uses .srcElement, FF .target
	var current = (evt.target) ? evt.target : evt.srcElement;
	
	current.style.borderColor='#000';
}

/**
 * Called when a user clicks the rating bar in the list. Updates the data array,
 * the hidden field and the style of the rating bar.
 * 
 * @param {Object} evt HTML event object
 * @param {Object} no Specifies the rating bar element
 */
function rate(evt, no){
	//IE uses .srcElement, FF .target
	var current = (evt.target) ? evt.target : evt.srcElement;
	var cell = current.parentNode.parentNode;
	setRatingHTML(cell,no);
	ftable.updateExpertise(cell.getAttribute("nodeid"),no);
	var bars = getElementsByTagAndClassName("DIV",null,cell);	
	markBars(bars,no);
}

/**
 * Called when a user clicks the rating bar in the popup windows. 
 * Updates the hidden field and the style of the rating bar.
 * 
 * @param {Object} evt HTML event object
 * @param {Object} no Specifies the rating bar element
 */
function ratePopup(evt, no){
	//IE uses .srcElement, FF .target
	var current = (evt.target) ? evt.target : evt.srcElement;
	var cell = current.parentNode.parentNode;
	setRatingHTML(cell,no);
	var bars = getElementsByTagAndClassName("DIV",null,cell);	
	markBars(bars,no);
}

/**
 * Colors the rating bar according to the selected item.
 * 
 * @param {Object} bars The rating bar elements (DIV node objects)
 * @param {Object} no Specifies the rating bar element
 */
function markBars(bars,no){
	if(no==0){
		var myspan = getElementsByTagAndClassName("span",null,bars[0].parentNode.parentNode)[0];
		myspan.innerHTML = "";
	}
	for(i=1;i<6;i++){
		var bar = bars[i-1];
		if(i>no){
			bar.style.backgroundColor='#ffffff';
		}else{
			if(i==no){
				// Insert title
				var myspan = getElementsByTagAndClassName("span",null,bar.parentNode.parentNode)[0];
				var curTitle = bar.parentNode.title;
				myspan.innerHTML = curTitle;
			}
			switch(i){
				case 1:
					bar.style.backgroundColor='#8cbfd8';
					break;
				case 2:
					bar.style.backgroundColor='#8cbfd8';
					break;
				case 3:
					bar.style.backgroundColor='#8cbfd8';
					break;
				case 4:
					bar.style.backgroundColor='#8cbfd8';
					break;
				case 5:
					bar.style.backgroundColor='#8cbfd8';
					break;
			}			
		}
	}
	
}

/**
 * Saves the given rating value in a hidden field contained in td.
 * @param {Object} td The object containing the hidden field 
 * @param {Object} value The rating value to be saved
 */
function setRatingHTML(td,value){
	var inp = getElementsByTagAndClassName("input",null,td);
	inp[0].value=value;
}

/**
 * Returns the given rating value from a hidden field contained in td.
 * 
 * @param {Object} td The object containing the hidden field 
 * @return The rating
 */
function getRatingHTML(td){
	var inp = getElementsByTagAndClassName("input",null,td);
	return inp[0].value;
}

/**
 * @deprecated use preferences.showTempDialog instead
 * Shows the dialog after saving the profile.
 */
function profile_showDialog(){
	var dialog = dojo.widget.byId("Dialog_profile");
	dialog.show();
}


/**
 * @deprecated use preferences.showTempDialog instead
 * Closes the profile dialog.
 */
function profile_closeDialog(){
	var dialog = dojo.widget.byId("Dialog_profile");
	dialog.hide();
}


/**
 * Saves all list entries which have an expertise value > 0
 * to the database. 
 */
function submitEntries(){
	var url = tgurl + "/profile/setExpertise?nocache=" + (new Date()).getTime() + "&";
	var qs = entries2QueryString();
	url += qs;
	var d = loadJSONDoc(url,{});
	if(d)
		d.addCallback(function(){
			preferences.showTempDialog("Your profile has been saved.");
		})
}

/**
 * Converts all entries in the expertise fields list to a querystring
 * 
 * @return {String} String of the form id1=exp.val1&id2=exp.val2&...
 */
function entries2QueryString(){
	var qs = ""
	for(var i = 0; i<ftable.data.length; i++){
		if( ftable.data[i].exp > 0 )
			qs += ftable.data[i].id + "=" + ftable.data[i].exp + "&";
	}
	return qs.substr(0,qs.length-1);
}

/**
 * Converts all entries in the expertise fields list to an
 * associative array.
 * 
 * @return {Object} Associative array with key value pair of the form {id1:exp.val1,id2:exp.val2,...}
 */
function entries2AssArray(){
	var assArray = {};
	for(var i = 0; i<ftable.data.length; i++){
		if( ftable.data[i].exp > 0 )
			assArray[ftable.data[i].id] = ftable.data[i].exp;
	} 
	return assArray;
}


/**
 * This function sends new preferences settings to the server.
 */
function settingEntry_save(){
	var anonymous = getElement("anonymous_check").checked;
	var email = getElement("email_check").checked;
	var newsletter = getElement("newsletter_check").checked;
					
	var cc_Button = MochiKit.DOM.getElement("preferencesSettings_Button");
	utils.dom.disableButton(cc_Button);
		
	d = callManager.doRequest("profile","update_setting",null,
			{"anonymous": anonymous,
			"email": email,
			"newsletter":newsletter,
			"nocache": (new Date()).getTime()});	
		
	if(d){
		d.addCallback(function(result){
			preferences.showTempDialog("Your setting has been saved.");
			setStatus("Saved new settings.");
			utils.dom.enableButton(cc_Button);
		});
	}
}
