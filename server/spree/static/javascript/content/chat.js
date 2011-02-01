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
 * Chat related functions and objects
 */


var chat = {
	/**
	 * Lets the chat partners name blink when he writes something
	 * 
	 * @param {Object} result JSON request result object (result of chat_getEntries)
	 */
	showActivity: function(result){
		//nothing new
		if(result.chat_entries.length == 0){
			return;
		}
		
		//last entry was writen by the user
		var byMe = result.chat_entries[result.chat_entries.length-1].byMe;
		
		//only highlight if the other wrote something
		if(byMe) 
			return;
		
		var iAmUser = MochiKit.DOM.getElement("chat_data_isExpert").value != "True";
		
		var elem;
		
		if(iAmUser){
			elem = MochiKit.DOM.getElement("chat_metadata_expert");
		}
		else{
			elem = MochiKit.DOM.getElement("chat_metadata_user");
		}
		
		//blink element
		MochiKit.Visual.pulsate(elem, {"pulses":3});
	}
};

var allchats = {	
	/**
	 * Marks a menu item as selected
	 * 
	 * @param {String} menuItem The menu item to be selected
	 */
	selectMenu : function(menuItem){
		var allChatsHeader = MochiKit.DOM.getElement("allchats_header");
		if(!allChatsHeader) return;
		var allMenuItems = MochiKit.DOM.getElementsByTagAndClassName(null, "actionlink", allChatsHeader);
		
		for(var i=0; i< allMenuItems.length; i++){
			dojo.html.removeClass(allMenuItems[i],'actionlinkSelected');
		}
		switch(menuItem){
			case null:
			
			case '':
			case "all": 
				dojo.html.addClass(allMenuItems[0],'actionlinkSelected');
				break;
			case "user":
				dojo.html.addClass(allMenuItems[1],'actionlinkSelected');
				break;
			case "expert":
				dojo.html.addClass(allMenuItems[2],'actionlinkSelected');
				break;			
		}
	},
	/**
	 * Show only chats where user is expert
	 * 
	 */
	showExpertChats: function(){
		var all = getElement("allchatsContent");
		var all_user = getElementsByTagAndClassName(null,"chatEntryUser",all);
		var all_expert = getElementsByTagAndClassName(null,"chatEntryExpert",all);
		for(var i=0; i<all_user.length; i++){
			all_user[i].style.display = "none";
		}
	    for(var i=0; i<all_expert.length; i++){
			all_expert[i].style.display = "";
		}
	},	
	/**
	 * Show only chats where user is user(i.e. not expert)
	 * 
	 */
	showUserChats: function(){
		var all = getElement("allchatsContent");
		var all_user = getElementsByTagAndClassName(null,"chatEntryUser",all);
		var all_expert = getElementsByTagAndClassName(null,"chatEntryExpert",all);
		for(var i=0; i<all_expert.length; i++){
			all_expert[i].style.display = "none";
		}
	    for(var i=0; i<all_user.length; i++){
			all_user[i].style.display = "";
		}
	},
	/**
	 * Show all chats
	 */
	showAllChats: function(){
		var all = getElement("allchatsContent");
		var all_user = getElementsByTagAndClassName(null,"chatEntryUser",all);
		var all_expert = getElementsByTagAndClassName(null,"chatEntryExpert",all);
		for(var i=0; i<all_expert.length; i++){
			all_expert[i].style.display = "";
		}
	    for(var i=0; i<all_user.length; i++){
			all_user[i].style.display = "";
		}
	}
};

/**
 * Loads the chat content box given a query id.
 * 
 * @param {int} query_id Specifies which chat should be loaded
 */
function chat_loadContent(query_id){
	
	var d = setContent("chat", query_id);
				
	return d;
}

/**
 * Fill the chat table with all entries using a JSON-Call.
 * 
 * @param {Object} result - the json result from "/content/chat/getAllEntries/"
 */
function chat_loadTable(result)
{
	if(result == null){
		return;
	}
	
	if(result.chat_entries.length == 0){
		chat_setFinished(result);
		return;
	}
	
	chat_cleanFakedRows();

	var chat_out = getElement("chat_out_table_body");

	appendRow = function(row){
		var text = utils.dom.text2html(row.text);		
		var tr = MochiKit.DOM.TR({'id': 'chat_entry_'+ row.id},MochiKit.Base.map(MochiKit.Base.partial(MochiKit.DOM.TD, null), [row.date, row.user, text]));
		tr.childNodes[2].innerHTML=tr.childNodes[2].childNodes[0].nodeValue;
		MochiKit.DOM.appendChildNodes(chat_out, tr);
	}
	
	MochiKit.Base.map(appendRow, result.chat_entries)
	chat_setFinished(result);

	pollingManager.resetInterval();
	
	//scroll down so the user always sees the newest comments first
	
	if(result.chat_entries.length > 0){
		scrollToBottom();
		chat.showActivity(result);
	}
}

/**
 * Add the text the user entered directly to the chat table so the user gets the feeling
 * of a highly responsive application.
 * 
 * @param {Object} text - the text entered by the user
 */
function chat_fakeUpdate(text){
	var chat_out = MochiKit.DOM.getElement("chat_out_table_body");
	
	var display_name = MochiKit.DOM.getElement("chat_out_display_name").value;
	
	var convertedText = utils.dom.text2html(text);
	var tr = MochiKit.DOM.TR({'id':'chat_dummy_row'},MochiKit.Base.map(MochiKit.Base.partial(MochiKit.DOM.TD, null), [utils_getTimeString(), display_name, convertedText]));
	tr.childNodes[2].innerHTML=tr.childNodes[2].childNodes[0].nodeValue;
	MochiKit.DOM.appendChildNodes(chat_out, tr);
	return;
}

/**
 * Delete the fake chat entries added by chat_fakeUpdate.
 * 
 * This is called when the 'real' entries arrive from the server.
 */
function chat_cleanFakedRows(){
	var chat_out = getElement("chat_out_table");
	var rows = chat_out.getElementsByTagName("tr");
	for( var i = rows.length-1; i >= 0; i--){
		if(rows[i].getAttribute("id") == 'chat_dummy_row'){
			MochiKit.DOM.removeElement(rows[i]);
		}
		else{
			break;
		}
	}	
}

/**
 * Sets the finished flag to true whenever this chat was finished
 * 
 * @param {Object} result - the json result from "/content/chat/getAllEntries/"
 */
function chat_setFinished(result){

	//alert(result);
	if(chat_wasFinished()){
		return;
	}
	
	if(result.session_status == "FINISHED" || result.session_status == "RATED"){
		var query_id = MochiKit.DOM.getElement('chat_query_id').value;
		getElement("chat_data_status").value = "FINISHED";
		chat_loadContent(query_id);
	}
	else{
		//alert(result.session_status)
	}
}

/**
 * Returns the id (as string) of the last entry in the chat_table.
 * It's NOT the element-ID by the database-id of this entry which is encode
 * as part of it's element-id.
 */
function chat_getLastEntryID(){
	var chat_out = getElement("chat_out_table");
	var rows = chat_out.getElementsByTagName("tr");

	if(rows.length==0){
		return "-1";
	}
	
	for( var i = rows.length-1; i >= 0; i--){
		lastRow = rows[i];
		if(lastRow.getAttribute("id") != 'chat_dummy_row'){
			break;
		}
	}
	var id_string = lastRow.getAttribute("id").split("_")[2];
	
	return id_string;
}

/**
 * Returns true if the current logged in user was as an expert.
 */
function is_expert(){
	return getElement("chat_data_isExpert").value == "True";
}


/**
 * Returns true if the chat is finished.
 */
function chat_wasFinished(){
	return getElement("chat_data_status").value == "FINISHED"
		|| getElement("chat_data_status").value == "RATED";
}

/**
 * All chat entries to the currently set session id.
 */
function chat_getEntries(){
	if(chat_wasFinished()){
		//scrollToBottom();
		return;
	}
	
	var lastChatID = chat_getLastEntryID();
	var query_id = MochiKit.DOM.getElement('chat_query_id').value;
	var d = callManager.doRequest('chat','getEntries',query_id + "/" + lastChatID,null,[chat_loadTable]);
	if(d == null){
		return;
	}
	return d;
}

/**
 * Send a chat entry to the server
 */
function chat_commit(){
	var chatInNode = getElement("chat_in");
	var chattext = chatInNode.value;
	var query_id = MochiKit.DOM.getElement('chat_query_id').value;
	var d = callManager.doRequest('chat','send', query_id, {"text": chattext}, chat_getEntries);
	
	if(d != null){
		chat_fakeUpdate(chattext);
	
		//set blank
		chatInNode.value = "";
		scrollToBottom();
		chatInNode.focus();
	}

	return false;
}

/**
 * Shows the dialog box for chat rating.
 */
function chat_rate_showDialog(query_id){
	var dialog = dojo.widget.byId("DialogContent");
	var btn = document.getElementById("chat_dialog_hider");
	dialog.setCloseControl(btn);
	dialog.show();
}

/**
 * Cancels the chat rating process.
 */
function chat_rate_cancelDialog(){
	var dialog = dojo.widget.byId("DialogContent");
	dialog.hide();
}


/**
 * Finish the chat
 */
function chat_finish(query_id){
	var d = callManager.doRequest('chat','finish', query_id, null);
		
	if(d != null){
		d.addCallback(function(result){
			setStatus("Finished chat");
			
			refreshBoxes(0);			
			
			if(is_expert()){
			   chat_loadContent(query_id);
			}
			else{
			  var d= chat_loadContent(query_id);
			  if(d) d.addcallback(chat_createContent);
			}
		})	
	}
}

/**
 * Rate this chat
 * 
 * @param {Object} query_id Specifies the chat to be rated
 */
function chat_rate(query_id){
	var e = MochiKit.DOM.getElement("chat_rating_radio_1");
	var buttons =[];
	
	for (var i=1;i<6; i++){
		buttons[i-1] = MochiKit.DOM.getElement("chat_rating_radio_" + i);

	}
	
	for(i=0;i<buttons.length; i++){
		if(buttons[i].checked == true){
			//d = loadJSONDoc("/content/chat/rate/" + query_id + "/" + buttons[i].value,{"nocache": (new Date()).getTime()});
			var d =  callManager.doRequest("chat","rate", + query_id + "/" + buttons[i].value, null);
			d.addCallback(function(result){
				setStatus("Saved new Rating.");
				chat_loadContent(query_id);
			})	
			
			break;
		}
	}
	
	unselectQuery(true);
}


/**
 * Returns true if the blog entry exists.
 */
function exist_blogEntry(){
	return getElement("chat_exist_blog").value == "True";
}


/**
 * Toggles the different elements of the chat content widget depending on the chat state.
 * 
 * @param {Object} result Arbitrary object, is acually not used but only returned
 * @return {Object} The result parameter
 */
function chat_createContent(result){
	var status = getElement("chat_data_status").value;
	var isExpert = getElement("chat_data_isExpert").value;

	if(status != 'FINISHED' && status != 'RATED'){
		getElement("chat_input").style.display = "";
		var d = chat_getEntries();
		if(d) d.addCallback(scrollToBottom);
	}
	else{
		getElement("chat_input").style.display = "none";
		if(is_expert() && !exist_blogEntry()){
			getElement("chat_create_blog").style.display = "";
		}
		else if(is_expert() && exist_blogEntry()){
			getElement("exists_blog_entry").style.display = "";
		}
		else{
			if(status != 'RATED'){
				var query_id = MochiKit.DOM.getElement('chat_query_id').value;
				chat_rate_showDialog(query_id);
			}
			else{
				getElement("chatFinished").style.display = "";
			}
		}
		scrollToBottom();
	}
	
	return result;
}


/**
 * Polling new chat entries when chat is current content
 * 
 * @param counter Polling manager internal counter
 */
function chat_refresh(counter){
	if(counter % 3 == 0){
		var node = MochiKit.DOM.getElement("chatContent");
		if(node != null){
			chat_getEntries();
		}
	}
}


/**
 * Displays the query overview.
 * 
 * @param {int} query_id Specifies the desired query
 */
function chat_query_overviewContent(query_id){
	var d = setContent("query_overview", query_id);
	return d;
}

/**
 * Scrolls the chat window to bottom
 */
function scrollToBottom(){
	var chat_out = getElement("chat_out");
	chat_out.scrollTop = chat_out.scrollHeight;
}

/**
 * Returns to previous content
 */
function do_return(){
	unselectQuery(true);
	historyManager.setLastContent(true);
}


/**
 * Displays an overview over all chats.
 */
function allchatsLoadContent(){
	setContent("chat_overview");
}


/**
 * Send on enter. Don't send on "Ctrl"+"Enter" but do a newline.
 * 
 * @param {Object} event - the keyUp event (only FF sends it, window.event in IE)
 */
function chat_handleKey(event){
	var e;
	
	//IE
	if(window.event){
		e = window.event;
	}
	//FF
	else{
		e = event;
	}
	
	// if enter pressed
	if(e.keyCode == 13){
		//if ctrl pressed as well
		if(e.ctrlKey){
			//add new line
			var chatInNode = getElement("chat_in");
			chatInNode.value += '\n';
			
			//stupid IE doesn't move the cursor to the new line so we force that.
			if(window.event){
				var range = document.selection.createRange();	
				range.select();
			}
		}
		//send when ctrl was not pressed
		else{
			chat_commit();
		}
		var chat_in = getElement("chat_in");
		chat_in.scrollTop = chat_in.scrollHeight;
	}
}
