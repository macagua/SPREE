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
 * Functions for managing the incoming/outgoing question boxes and the 
 * statistics and highscore boxes. 
 */

// used to determine if any new questions arrived (to notify somehow the user)
var currQueriesIn = [];
var firstLoad = true;

/**
 *  Is called by the polling manager to update the boxes' content.
 *  @param {int} counter Controls if the box is to be updated 
 */
function refreshBoxes(counter){
	// load the i/o boxes
	if(counter % 7 == 0){
		var d = callManager.doRequest('box', 'io', null, null,
			[function(res){
				loadIOBoxes(res);	
				return res;
			}]
		);
	}
	
	return d;
}

/**
 *  Is called by the polling manager to update the boxes' content.
 *  @param {int} counter Controls which box is to be updated 
 */
function refreshRightBoxes(counter){
	// load the statistics box
	if(counter % 15 == 0){
		var d = callManager.doRequest('box','statistics', null, null,
			[function(res){
				replaceNode("statisticsBoxContent", res);
				return res;
			}]
		);
	}
	// load the highscore box
	if(counter % 23 == 0){
		var d = callManager.doRequest('statistics','getHighscoreList', null, null,
			[function(res){
				replaceNode("highscores_listContent", res);
				return res;
			}]
		);
	}
	
	return d;
}


/**
 * Load the data of the IO-Boxes with the result of the
 * JSON call.
 * @param {Object} The result of the JSON request
 */
function loadIOBoxes(result){

	boxes_loadQueryBox("incoming", result.queries_in);
	boxes_loadQueryBox("outgoing", result.queries_out);
	
	var qidin = [];
	for(var i = 0; i<result.queries_in.length; i++){
		 qidin.push(result.queries_in[i].query_id);
	}
	if(!firstLoad && !utils.arrays.isSubset(qidin,currQueriesIn)){
		attractAttention("New Question!");
	}
	currQueriesIn = currQueriesIn.concat(qidin);
	firstLoad = false;
}

/**
 * Tries to attract the attention of the user
 * @param {String} msg The message to be presented to the user
 */
function attractAttention(msg){
	utils.blinking.message = msg;
	utils.blinking.blink();
}

/**
 * Load the data of the I- or O-Box with the result of the
 * JSON call.
 * 
 * @param {String} type - 'incoming' or 'outgoing'
 * @param {Array} queries - list of queries returned from the server
 */
function boxes_loadQueryBox(type, queries){
	var ulElem = MochiKit.DOM.getElement(type+"_box");
	
	var listElems = MochiKit.DOM.getElementsByTagAndClassName("li", null, ulElem);
	
	// fill all list elements if a query exists
	for(var i=0; i< listElems.length-1; i++){
		var elem = listElems[i];
		if(i < queries.length){
			
			// change layout
			var query = queries[i];
			
			var status = query.in_out + "_" + query.status;
			status += "_" + (query.isOnline ? "online" : "offline");
			
			if(current_query_id == query.query_id){
				elem.className = status + ' selected';				
			}
			else{
				elem.className = status;
				elem.lang = status;
			}
			
			//save query status in lang field
			elem.setAttribute("lang", status);
			elem.setAttribute("id", "boxentry_" + query.query_id);
			
			if(i % 2 == 0){
				elem.setAttribute("style","background-color:#FFF");
				elem.getAttribute("style").backgroundColor = "#FFF";
			}
			else{
				elem.setAttribute("style","background-color:#ccc");
				elem.getAttribute("style").backgroundColor = "#ccc";
			}
							
			//IE needs it very explicit!
			elem.getAttribute("style").display = '';
			elem.getAttribute("style").opacity = 1;			
			
			// fill elems with new data
			var topicElem = MochiKit.DOM.getFirstElementByTagAndClassName("h3", null, elem);
			//var dataElem = MochiKit.DOM.getFirstElementByTagAndClassName("p", null, elem);
			
			MochiKit.DOM.swapDOM(topicElem, MochiKit.DOM.H3(query.topic));
			
			// create the additional information
			var dataString = query.date;
			if (query.user){
				dataString += ", " + query.user;				
			}
			//MochiKit.DOM.swapDOM(dataElem, MochiKit.DOM.P(dataString));
			
			elem.title = boxes_getTitleForQuery(type, query);
		}
		else{
			elem.className = "hidden";
			elem.setAttribute("id", "boxentry_-1");
		}
	}
	
	// no entries no fun
	var noEntriesElem = listElems[listElems.length-1];
	if (queries.length == 0){
		noEntriesElem.className = "noEntries";
	}
	else{
		noEntriesElem.className = "hidden";
	}
}

/**
 * The tooltip (title) for a given query
 * 
 * @param {String} type - 'incoming' or 'outgoing'
 * @param {Object} query - query object returned from the server
 */
function boxes_getTitleForQuery(type, query){
	var status = query.status;
	
	var title = "";
	
	if( status != 'new'){
		if( status == 'finished'){
			title = "Rate this chat"
		}
		else{
			title = "Go to chat";
			if(!query.isOnline){
				if (type == "incoming"){
					title = title + " (User offline)"
				}
				else{
					title = title + " (Expert offline)"
				}
			}
		}
		return title;
	}
	
	if (type == "incoming"){
		title = "Show question details";
		if(!query.isOnline){
			title = title + " (User offline)"
		}
	}
	else{
		title = "Show expert search results";
	}
	
	return title;
}

/**
 * This function is called whenever a query was clicked.
 * 
 * Loads the content dependign on the query type and status.
 * 
 * @param {String} type - 'incoming' or 'outgoing'
 * @param {Object} queryElem - the calling element (query entry)
 */
function boxes_selectQuery(type, queryElem){
	unselectQuery();

	var query_id = queryElem.id.substr(9);
	var queryStatus = queryElem.lang;
	
	if(queryStatus.indexOf("myTurn") != -1 
		|| queryStatus.indexOf("notMyTurn") != -1 
		|| queryStatus.indexOf("finished") != -1){
		chat_loadContent(query_id);
	}
	else if(queryStatus.indexOf("new") != -1){
		if(type == 'incoming'){
			setContent('query_overview', query_id);
		}
		else{
			loadWaitBoxContent(query_id);
		}
	}
	
	setSelectedQuery(query_id);
}

/**
 * Visualizes the selected query box entry
 * 
 * @param {int} query_id The query id
 */
function setSelectedQuery(query_id){
	if(query_id == -1)
		return;
	
	// set the all questions link to selected
	if(query_id == -10){
		elem_id = "allquestionslink";
		elem = MochiKit.DOM.getElement(elem_id);
	}
	else{
		elem_id = "boxentry_" + query_id;
		elem = MochiKit.DOM.getElement(elem_id);
	}
	
	if(elem == null || elem.className =="selected"){
		return;
	}
	current_query_id = query_id;

	elem.className = elem.className + " selected";
}

/**
 * Unselect the last selected query
 * 
 * @param {boolean} fade If true the last selected element will be hidden
 */
function unselectQuery(fade){
	if(current_query_id == -1){
		return;
	}
	
	// set the all questions link to selected
	if(current_query_id == -10){
		elem_id = "allquestionslink";
		elem = MochiKit.DOM.getElement(elem_id);
	}
	else{
		elem_id = "boxentry_" + current_query_id;
		elem = MochiKit.DOM.getElement(elem_id);
	}
			
	if(elem == null){
		return;
	}

	// no fading as we update to fast
	if(fade){
		elem.className = "hidden";
	}
	else{
		elem.className = elem.lang;		
	}	
	current_query_id = -1;
}
