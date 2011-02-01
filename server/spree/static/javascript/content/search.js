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
 * Search related functions (ASK Tab)
 */

var lastCategories = [];

var search_questionVal;
var search_subjectVal;
var search_keywordsVal;
var search_categoriesVal;
var search_catIDs = [];
var search_userlist;

var waitSearchLastState = "";

// flag determining if user wants to select an expert by himself
var search_isDirect = false;

/**
 * Structure for the categories, compatible to profile structure
 */
var search_catStruct = [];

var tagCloudElemInnerHTML = null;


/**
 * Displays the wait page after search is commited.
 *
 * @param {int} query_id The query ID
 */
function loadWaitBoxContent(query_id){
	if (query_id == null)
		query_id = -1;
	setContent("waitSearch",query_id);
}

/**
 * This function sends a new query to the server and 
 * updates all boxes where changes are expected. 
 * 
 * It also replaces the content view with the 'WaitContent'.
 * 
 * @param {int} query_id The query ID
 */
function search_doQuery(query_id){
		
	search_questionVal = null;
	search_subjectVal = null;
	search_keywordsVal = null;
	search_categoriesVal = null;
	search_catIDs = [];
	
	var query = getElement("searchcontent_question").value;
	var topic = getElement("searchcontent_topic").value;
	
	if (lastCategories.length == 0 || topic.length + query.length < 10){
		searchExpert_showDialog();
		return;
	}
	
	var searchButton = MochiKit.DOM.getElement("searchcontent_findButton");
	searchButton.disabled = true;

	// 1st send the query
	var d = callManager.doRequest('search', 'doQuery', null, 
			{"query": query,
				"topic": topic,
				"categories_set": lastCategories,
				"query_id": query_id},
			[function(result){
				current_query_id = result.query_id;	
				loadWaitBoxContent(result.query_id);
				refreshBoxes(0);
				setStatus("Your question was forwarded to the experts");
				return result;
			}]
	)
}

/**
 * Sets the entry of the combo box
 * 
 * @param {Object} id - the entry id
 */
function search_setCategory(id){
	var combo = MochiKit.DOM.getElement("searchcontent_categories");
	for(var i=0; i< combo.options.length; i++){
		if(combo.options[i].value == id){
			combo.options.selectedIndex = i;
			break;
		}
	}
}

/**
 * Triggers the server side keyword extraction from a given text string
 * 
 * @param {Object} text - the text
 */
function search_getKeywords(text){
	var args = {"text": text,
			"nocache": (new Date()).getTime()};
	var d2 = callManager.doRequest("search","getKeywords",null,args);
	return d2;
}

/**
 * Asks the server about the classification of text and subject.
 * 
 * @param {Object} topic - the topic (subject)
 * @param {Object} text - the text
 * 
 * @return deferred
 */
function search_getClassification(topic, text){
	var args = {"topic":topic,
        		"text": text,
				"nocache": (new Date()).getTime()};
	var d = callManager.doRequest("search","getKeywordsAndCategories",null,args);
	return d;
}
/**
 * Completes the topic field with the initial letters of the question
 * 
 * @param {Object} txt - the question text
 */
function search_autoCompleteTopic(txt){
	var topic = txt.substr(0,50);
	var topicElem = MochiKit.DOM.getElement("searchcontent_topic");
	
	if (topicElem.getAttribute("lang") == "0"){
		topicElem.value = topic;
	}
}

/**
 * If there isn't enough information about question shows the dialog.
 */
function search_showDialog(){
	var dialog = dojo.widget.byId("Dialog_search");
	dialog.show();
}


/**
 * Closes the search dialog.
 */
function search_closeDialog(){
	var dialog = dojo.widget.byId("Dialog_search");
	dialog.hide();
}


/**
 * Sends the question + topic to the server, expects the result and 
 * displays the classification part of the query template
 */
function search_classifyQuery(){
	search_isDirect = false;
	search_hideHiddenDirect();
	var txtTopic = MochiKit.DOM.getElement("searchcontent_topic").value;
	var txtQuestion = MochiKit.DOM.getElement("searchcontent_question").value;
	if(txtTopic.length + txtQuestion.length < 10){
		search_showDialog();
		return;
	}
	search_saveAllValues();	
	var d = search_getClassification(txtTopic, txtQuestion);
	if (d==null){
		return;
	}
	d.addCallback(function(result){
		var keywordsElem = MochiKit.DOM.getElement("searchcontent_keywords");
		keywordsElem.value = result.keywords;
		
		search_setCategories(result.rows, result.html);
		
		MochiKit.DOM.getElement("searchcontent_question").rows = 2;
		getElement('btnContentClassify').innerHTML = "Re-classify";
		search_displayHidden();		
	});
}

/** 
 * Displays the classification part of the query template
 */
function search_showUserSelection(){
	search_hideHidden();
	search_isDirect = true;
	
	var btnselect = getElement('btnShowUsers');
	
	var txtTopic = MochiKit.DOM.getElement("searchcontent_topic").value;
	var txtQuestion = MochiKit.DOM.getElement("searchcontent_question").value;
	
	if(txtTopic.length + txtQuestion.length < 1){
		search_showDialog();
		return;
	}
	
	search_saveAllValues();	

	MochiKit.DOM.getElement("searchcontent_question").rows = 2;	
	search_displayHiddenDirect();	

	var d = callManager.doRequest('search','getUsers','');
	if (d){
		d.addCallback(function(result){
			getElement('btnContentClassify').innerHTML = "Search Expert";
			
			list = getElement('lstUsers');
			search_userlist = result.users;
			list.options.length = 0;
			var cbox = getElement('showOnlineOnly');
			
			for(var i=0; i<search_userlist.length; i++){
				if(cbox.checked && !search_userlist[i]['isonline']) continue;
				var opt = new Option();
				opt.value = search_userlist[i]['uid'];
				opt.text = search_userlist[i]['name'];
				list.options.add(opt);
			}
			list.selectedIndex = 0;
			if(list.options.length == 0) {
				utils.dom.disableButton('btnDirectChat');
			}else{
				utils.dom.enableButton(getElement('btnDirectChat'));
			}
			search_lstUsersSelected();
			return result;
		});
	}

}

/**
 * Displays additional user information about the selected user
 */
function search_lstUsersSelected(){
	list = getElement('lstUsers');
	var elemName = getElement('usrName');
	var elemStatus = getElement('usrStatus');
	if(list.options.length<1){
		elemName.innerHTML = "&nbsp;";
		elemStatus.innerHTML = "&nbsp;";
		return;
	}
	var opt = list.options[list.selectedIndex];
	var user;
	for(var i = 0; i<search_userlist.length; i++){
		user = search_userlist[i];
		if(user.uid == opt.value) break;
	}
	
	var status = user.isonline ? "Online" : "Offline";
	elemName.innerHTML = opt.text;
	elemStatus.innerHTML = status;
}

/**
 * Creates a new query and contacts the selected user
 */
function search_startDirectChat(query_id){
	search_questionVal = null;
	search_subjectVal = null;
	search_keywordsVal = null;
	search_categoriesVal = null;
	search_catIDs = [];
	
	var query = getElement("searchcontent_question").value;
	var topic = getElement("searchcontent_topic").value;
	
	if(topic.length + query.length < 1){
		search_showDialog();
		return;
	}
	
	if(query.length <1) query = topic;
	if(topic.length <1) topic = query;
	
		
	utils.dom.disableButton('btnDirectChat');

	var list = getElement('lstUsers');
	var expertid = list.options[list.selectedIndex].value;
	
	// 1st send the query
	var d = callManager.doRequest('search', 'doDirectChat', null, 
			{"query": query,
				"topic": topic,
				"expertid": expertid,
				"query_id": query_id},
			[function(result){
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

/**
 * Shows hidden elements in the search template. These are the keywords + categories areas
 */
function search_displayHidden(){
		// display only if not in direct chat mode
		if(search_isDirect) return;
		var hiddenElems = MochiKit.DOM.getElementsByTagAndClassName(null, 'searchRow', MochiKit.DOM.getElement('searchContent'));
		
		for (var i=0; i< hiddenElems.length; i++){
			dojo.html.removeClass(hiddenElems[i],'hidden');
		}
}

/**
 * Hides hidden elements in the search template. These are the keywords + categories areas
 */
function search_hideHidden(){
		var hiddenElems = MochiKit.DOM.getElementsByTagAndClassName(null, 'searchRow', MochiKit.DOM.getElement('searchContent'));
		
		for (var i=0; i< hiddenElems.length; i++){
			dojo.html.addClass(hiddenElems[i],'hidden');
		}
}

/**
 * Shows hidden elements in the search template used for direct chat.
 */
function search_displayHiddenDirect(){
		// display only if not in direct chat mode
		if(!search_isDirect) return;
		var hiddenElems = MochiKit.DOM.getElementsByTagAndClassName(null, 'selectRow', MochiKit.DOM.getElement('searchContent'));
		
		for (var i=0; i< hiddenElems.length; i++){
			dojo.html.removeClass(hiddenElems[i],'hidden');
		}
		document.getElementsByTagName('select')[0].style.visibility='visible';
}

/**
 * Hides hidden elements in the search template used for direct chat.
 */
function search_hideHiddenDirect(){
		var hiddenElems = MochiKit.DOM.getElementsByTagAndClassName(null, 'selectRow', MochiKit.DOM.getElement('searchContent'));
		
		for (var i=0; i< hiddenElems.length; i++){
			dojo.html.addClass(hiddenElems[i],'hidden');
		}
		document.getElementsByTagName('select')[0].style.visibility='hidden';
}

/**
 * Inserts the categories nto the categories field.
 * 
 * @param {Object} cats - see search_ClassifyQuery
 */
function search_setCategories(cats, html){
	search_catStruct = cats;
	lastCategories = [];
	var categoriesString = "";		
	
	if (html != null){
		for(var i=0; i<search_catStruct.length; i++){
			if(!search_catStruct[i].distance) search_catStruct[i].distance = 0;
			lastCategories[lastCategories.length] = search_catStruct[i].id;
		}

		var categoriesElem = MochiKit.DOM.getElement("searchcontent_categories");
		categoriesElem.style.display = "";
		categoriesElem.innerHTML = html;
			
	}
	else{
		for(var i=0; i<search_catStruct.length; i++){
			if(!search_catStruct[i].distance) 
				search_catStruct[i].distance = 0;
			categoriesString += search_catStruct[i].label +"&nbsp;&nbsp;"+"\t";
			lastCategories[lastCategories.length] = search_catStruct[i].id;
		}

		if(categoriesString.length > 2){
			categoriesString = categoriesString.substr(0,categoriesString.length-2);
		}
		var categoriesElem = MochiKit.DOM.getElement("searchcontent_categories");
		categoriesElem.style.display = "";
		categoriesElem.innerHTML = categoriesString;
	}
	
	tagCloudElemInnerHTML = categoriesElem.innerHTML;
}

/**
 * Declines the specified query
 * @param {Object} query_id The query ID
 */
function doDecline(query_id){
	var d = callManager.doRequest('search','doDecline', query_id, null);
	if(d == null){
		return;
	}
	
	d.addCallback(function dummy(result){
		unselectQuery(true);
		setContent("search");
		refreshBoxes(0);
		return result;
	});
	setStatus("Question declined.");	
}

/**
 * Constantly refreshes the search wait component
 * 
 * @param {Object} counter - the polling counter
 */
function search_refresh(counter){
	if(counter % 11 == 0){	
		var waitContent = MochiKit.DOM.getElement("waitSearchContent");
		// expert side
		if(waitContent == null){

			var queryOverviewContent = MochiKit.DOM.getElement("queryOverviewContent");
			var queryIDElem = MochiKit.DOM.getElement("queryoverview_query_id");
			if(queryOverviewContent != null && queryIDElem != null){
				var d = callManager.doRequest('search','getQueryStatus', queryIDElem.value, null);
				if(d == null){
					return;
				}
				d.addCallback(function dummy(result){
					// query was taken by another expert
					if(result.taken){
						if(MochiKit.DOM.getElement("queryoverview_taken") == null){
							setContent2("query_overview",current_query_id);
						}
					}
				});				
			}
		}
		// user side
		else{
			var status = MochiKit.DOM.getElement("waitsearch_doPolling");
			if (status.value == "False"){
				return;
			}
			var d = callManager.doRequest('search','getExpertsStatus', current_query_id, null);
			if(d == null){
				return;
			}
			d.addCallback(function dummy(result){
				search_updateExperts(result);
				return result;
			});
		}
	}
}

function search_clear(){
	MochiKit.DOM.getElement("searchcontent_question").value = "";
	MochiKit.DOM.getElement("searchcontent_topic").value = "";
	search_hideHidden();
	MochiKit.DOM.getElement('btnContentClassify').innerHTML = "Search Expert";
	MochiKit.DOM.getElement("searchcontent_question").focus();
}

/**
 * Updates the expert information for the wait search content
 * 
 * @param {Object} result - the result from getExpertStatus
 */
function search_updateExperts(result){
	if(result.finished){
		setContent2("waitSearch",current_query_id);
		return;
	}
	
	if(waitSearchLastState == ""){
		//waitSearchLastState = result.state;
	}
	var accepted = result.experts_accepted;
	var declined = result.experts_declined;
	
	var declined_string = "";
	var accepted_string = "";
	
	for(var i=0; i< accepted.length; i++){
		accepted_string += accepted[i] + ",";
	}
	
	for(var i=0; i< declined.length; i++){
		declined_string += declined[i] + ",";
	}

	MochiKit.DOM.replaceChildNodes(MochiKit.DOM.getElement("waitsearch_experts_declined"), document.createTextNode(declined_string));
	MochiKit.DOM.replaceChildNodes(MochiKit.DOM.getElement("waitsearch_experts_accepted"), document.createTextNode(accepted_string));
	
	if(waitSearchLastState != result.state){
		setContent2("waitSearch",current_query_id);
	}
	waitSearchLastState = result.state;
	
}

/**
 * Delete a query
 * 
 * @param {int} query_id The query ID
 */
function search_deleteQuery(query_id){
	d = callManager.doRequest('search','deleteQuery',query_id,null);
	unselectQuery(true);
	
	if(d){
		d.addCallback(function(result){
			setStatus("The question has been deleted...");
			setContent('search','');
			refreshBoxes(0);
		});
	}
}

/**
 * Saves all values from all input fields
 */
function search_saveAllValues(){
	search_questionVal = getElement('searchcontent_question').value;
	search_subjectVal = getElement('searchcontent_topic').value;
	search_keywordsVal = getElement('searchcontent_keywords').value;
	search_categoriesVal = getElement('searchcontent_categories').value;
	search_catIDs = [];
	for(var i=0; i<search_catStruct.length; i++){
		search_catIDs.push(search_catStruct[i]);
	}
}

/**
 * Fills all saved values into all input fields
 */
function search_restoreAllValues(){
	var filled = false;
	if(search_questionVal){
		filled = true;
		var qfield = getElement("searchcontent_question");
		qfield.value = search_questionVal;
		getElement('searchcontent_topic').value = search_subjectVal;
		getElement('searchcontent_keywords').value = search_keywordsVal;
		search_setCategories(search_catStruct);
	}
	if(filled){
		if(search_isDirect){
			search_displayHiddenDirect();
			search_showUserSelection();
		}
		else{ 
			search_displayHidden();
			getElement('btnContentClassify').innerHTML = "Re-classify";
		}
	}
	qfield.rows = 2;
}

/**
 * Displays the profile tree
 */
function search_classifyManually(){
	search_saveAllValues();
	setContent('profileSearch',null,{showHeaderSearch:true},true);
}

/**
 * Called when manual modifications should not be applied.
 * Returns to search.
 */
function search_classifyManuallyAbort(){
	var d = search_classifyCloseProfile();
	
	if(d){
		var html = tagCloudElemInnerHTML+"";
		d.addCallback(function(res){

			search_setCategories(search_catStruct, html);
			return res;
		});
	}
	return d;
}


function search_classifyCloseProfile(){
	search_catStruct = [];
	for(var j = 0; j<search_catIDs.length; j++){
		search_catStruct.push(search_catIDs[j]);
	}
	var d = setContent('search');
	return d;
}

/**
 * Called when manual modifications should be applied.
 * Applies changes and returns to search.
 */
function search_classifyManuallyAccept(){
	for(var i=0; i<search_catStruct.length; i++){
		var isNew = true;
		for(var j = 0; j<search_catIDs.length; j++){
			if(search_catStruct[i].id==search_catIDs[j].id) isNew = false;
		}
		if(isNew){
			search_catIDs.push(search_catStruct[i]);
		}
	}
	var fullTitleData = [];
	for(var i=0; i<ftable.data.length ;i++){

		var fentry = {};
		fentry.id = ftable.data[i].id;
		fentry.label = ftable.data[i].label; //ftable.getFullPath(fentry.id);
		fentry.fullpath = ftable.getFullPath(fentry.id);
		fentry.branch = ftable.getBranch(fentry.id);
		fullTitleData.push(fentry);
	}
	var d = search_classifyCloseProfile();
	if(d){
		d.addCallback(function(res){
			search_setCategories(fullTitleData);
			return res;
		});
	}
}


/**
 * If there isn't enough information about question shows the dialog.
 */
function searchExpert_showDialog(){
	var dialog = dojo.widget.byId("Dialog_searchExpert");
	dialog.show();
}


/**
 * Closes the search dialog.
 */
function searchExpert_closeDialog(){
	var dialog = dojo.widget.byId("Dialog_searchExpert");
	dialog.hide();
}

