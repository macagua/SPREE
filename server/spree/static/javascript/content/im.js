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
 * Methods for the instant messenger content component. ('Chat' tab)
 * 
 */

var im = {}

/**
 * Holds current user list page
 */
im.currentPage = 1

/**
 * Called when this content is set.
 */
im.init = function(){
	im.loadUsers();
}

/**
 * Load all users and their online/offline status to the list
 */
im.loadUsers = function(pageNo){
	if(pageNo==undefined) pageNo = 1;
	// 1st send the query
	var d = callManager.doRequest('im', 'getUsers', null, 
			{showPage:pageNo},
			[function(result){
				im.currentPage = pageNo
				im.insertUsers(result);
				return result;
			}]
	)
}

/**
 * Insert the users into the DOM-tree.
 * 
 * @param {Object} result - the user list as html template delivered by the server
 */
im.insertUsers = function(result){
	var listBox = MochiKit.DOM.getElement("imUsersBox");
	var listElem = MochiKit.DOM.getElement("imUsers");
	
	var selectedUserId = -1;
	
	//remember selected id
	if(listElem){
		var names = MochiKit.DOM.getElementsByTagAndClassName(null, "selected", listElem);
		if(names.length > 0){
			selectedUserId = names[0].getAttribute('name');	
		}
	}
	
	if(!listBox){
		return;
	}

	if(listElem) var scrollTop = listElem.scrollTop;
	
	replaceNode(listBox, result);
	
	listElem = MochiKit.DOM.getElement("imUsers");
	
	//set selected user
	if(listElem && selectedUserId >= 0){
		var names = MochiKit.DOM.getElementsByTagAndClassName("li", null, listElem);
		for(var i=0; i<names.length; i++){
			if(names[i].getAttribute('name') == selectedUserId){
				names[i].className += " selected";
				break;
			}
		}
	}
}

im.lastUserDetailsDefered = null;

/**
 * Called when a user from the user list is clicked.
 * Call the server for details and shows them in the details widget.
 * 
 * @param {Object} elem - the clicked element
 */
im.showUserDetails = function(elem){
	if(im.lastUserDetailsDefered)
		im.lastUserDetailsDefered.cancel();	

	var listElem = MochiKit.DOM.getElement("imUsers");
	
	//unselect old entry
	if(listElem){
		var names = MochiKit.DOM.getElementsByTagAndClassName(null, "selected", listElem);
		if(names.length > 0){
			names[0].className = names[0].className.substr(0,names[0].className.length-9);		
		}
	}

	//select new entry
	var id = elem.getAttribute("name");
	elem.className += " selected";
	
	
	var d = callManager.doRequest('im', 'getUserDetails', id, 
			null,
			[function(result){
				var elem = 	MochiKit.DOM.getElement("imDetails");
				if(elem){
					replaceNode("imDetails", result);
				}
				return result;
			}]
	)
	if(d)
		im.lastUserDetailsDefered = d;
}

im.startChat = function(){
	var topic = MochiKit.DOM.getElement("imSubjectField").value;
	var text = MochiKit.DOM.getElement("imQuestionField").value;
	var expertid = MochiKit.DOM.getElement("userDetailsUserId").value;
	
	utils.dom.disableButton('imStartChat');

	// 1st send the query
	var d = callManager.doRequest('im', 'doDirectChat', null, 
			{   
				"topic": topic,
				"query": text,
				"expertid": expertid},
			[function(result){
				
				if(result.failure){
					setContent('im_expertFull','');
					return;
				}
				current_query_id = result.query_id;	
				loadWaitBoxContent(result.query_id);
				refreshBoxes(0);
				setStatus("The selected user has been contacted.");
				return result;
			}]
	)
}


/**
 * show the 'start chat' dialog
 */
/*
im.showDialog = function(){
	utils.dom.enableButton('dialogDirectChatCancel');
	utils.dom.enableButton('dialogDirectChatSend');
	MochiKit.DOM.getElement("dialogDirectChatSubjectField").value = "";
	MochiKit.DOM.getElement("dialogDirectChatQuestionField").value = "";
	MochiKit.DOM.getElement("dialogDirectChatSubjectField").setAttribute("lang",0);	
	var dialog = dojo.widget.byId("dialogDirectChat");
	dialog.show();
}*/

/**
 * close the 'start chat' dialog when 'start chat' was clicked
 */
/*
im.closeDialog = function(){
	var topic = MochiKit.DOM.getElement("dialogDirectChatSubjectField").value;
	var text = MochiKit.DOM.getElement("dialogDirectChatQuestionField").value;
	var expertid = MochiKit.DOM.getElement("userDetailsUserId").value;
	
	utils.dom.disableButton('dialogDirectChatCancel');
	utils.dom.disableButton('dialogDirectChatSend');

	// 1st send the query
	var d = callManager.doRequest('im', 'doDirectChat', null, 
			{   
				"topic": topic,
				"query": text,
				"expertid": expertid},
			[function(result){
				
				im.cancelDialog();
				if(result.failure){
					setContent('search_expertFull','');
					return;
				}
				current_query_id = result.query_id;	
				loadWaitBoxContent(result.query_id);
				refreshBoxes(0);
				setStatus("The selected user has been contacted.");
				return result;
			}]
	)
}
*/

/**
 * close the 'start chat' dialog when 'cancel' was clicked
 */
/*
im.cancelDialog = function(){
	var dialog = dojo.widget.byId("dialogDirectChat");
	dialog.hide();
}
*/

/**
 * ChatDialog.
 * Autocomplete the topic field with the first characters of the subject field
 * 
 * @param {Object} txt - the question's text
 */
im.autoCompleteTopic = function(txt){
	var topic = txt.substr(0,50);
	var topicElem = MochiKit.DOM.getElement("imSubjectField");
	
	if (topicElem.getAttribute("lang") == "0"){
		topicElem.value = topic;
	}
}

/**
 * Method called from polling manager
 * 
 * @param {Object} cycle - the tick counter
 */
im.update = function(cycle){
	if (cycle % 29 == 0){
		if(MochiKit.DOM.getElement("imContent")){
			im.loadUsers(im.currentPage);
		}
	}
}