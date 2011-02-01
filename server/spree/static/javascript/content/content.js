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
 * Functions for handling the main content
 */

/**
 * Each time the content changes the application enters a new state!
 * 
 * This method wrappes the setcontent2() method in that it creates
 * a state description for back/forward button handling.
 * 
 * @param {Object} type - new content type
 * @param {String} urlArgs - args to pass to the url (slash-separated)
 * @param {Object} kw_args - args to pass to the url (JSON Object)
 * @param {boolean} invalid - If true the content to be set will not be added to browser history
 * 
 * @return the deferred object from the loading
 */
function setContent(type, urlArgs, kw_args, invalid){
	var state = new ApplicationState(type, urlArgs, kw_args, setContent2);
	if(invalid) {state.setInvalid();}
	historyManager.addState(state);
	
	return setContent2(type, urlArgs, kw_args);
}

/**
 * Switches the content of the content box.
 * 
 * @param {Object} type - new content type
 * @param {Object} urlArgs - args to pass to the url (slash-separated)
 * @param {Object} kw_args - args to pass to the url (JSON Object)
 * 
 * @return the deferred object (can be used for adding callback functions)
 */
function setContent2(type, urlArgs, kw_args){
	setStatus('');
	
	var popup = getElement("ratePopup");
	if(popup) popupRateCancel();
	
	TreeBuilder.saveTree();
	
	var contentID = "content";
	var currentCSSClass = "current";
	var menuItem;
	var el = getElement(currentCSSClass);
	if(el != null)
		el.setAttribute("id",el.getAttribute("lang"));
	displayLoadingScreen(contentID);
	var d = callManager.doRequest('content', type, urlArgs, kw_args);
	if(d == null){
		return;
	}
	d.addCallback(replaceNode, contentID);	
	
	switch(type){
		case "search":
			d.addCallback(search_restoreAllValues);
			menuItem = getElement("searchMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;	
		case "waitSearch":
			unselectQuery();
			setSelectedQuery(urlArgs);
			waitSearchLastState = "";
			break;	
		case "blogs":
			menuItem = getElement("blogsMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "blogentry":
			menuItem = getElement("blogsMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "blog_content_edit":
			menuItem = getElement("blogsMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "feedback":
			menuItem = getElement("feedbackMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;		
		case "im":
			menuItem = getElement("imMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			d.addCallback(im.init);
			break;
		case "profile":
			d.addCallback(function(res){
				ftable.hideRating = false;
				return res;
			});
			d.addCallback(initProfile);
			d.addCallback(function(res){
				if(getElement('aPrefPersonal')){
					dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
					dojo.html.addClass('aPrefProfile','actionlinkSelected');
				}
				return res;
			});
			menuItem = getElement("profileMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case 'allquestions':
			unselectQuery();
			setSelectedQuery(-10);
			break;
		case "preferencesSettings":
			d.addCallback(function(){
				dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
				dojo.html.addClass('aPrefSettings','actionlinkSelected');
			});
			menuItem = getElement("profileMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "preferencesUpdateUser1":
		case "preferencesUpdateUser2":
		case "preferences":
			d.addCallback(function(){
				dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
				dojo.html.addClass('aPrefPersonal','actionlinkSelected');
			});
			menuItem = getElement("profileMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "register_new":
			d.addCallback(function dummy(res){
				registration.selectMenuitem(1);
				return res;
			});
			break;
		case "regProfile":
			d.addCallback(function dummy(res){
				registration.selectMenuitem(3);
				ftable.data = kw_args.cats;
				return res;
			});
			d.addCallback(initProfile);
			d.addCallback(switchButtons);
			break;
		case "register_load_docs":
			d.addCallback(function(res){
				registration.selectMenuitem(2);
				return res;
			});
			break;
		case "statistics":
			menuItem = getElement("statisticsMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;				
		case "chat":
			d.addCallback(chat_createContent);
			unselectQuery();
			
			d.addCallback(function(res){
				var d2 = refreshBoxes(0);
				current_query_id = urlArgs;
				return res;
			});
			break;
		case "query_overview":
			break;	
		case "chat_overview":
			d.addCallback(allchats.selectMenu, kw_args.chat_type);
			menuItem = getElement("imMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
		case "profileSearch":
			d.addCallback(function(res){
				var btn = getElement("btnSubmitProfile");
				btn.style.display = "None";
				btn = getElement("btnCategoriesBack");
				btn.style.display = "block";
				btn = getElement("btnCategoriesAccept");
				btn.style.display = "block";
				ftable.hideRating = true;
				
				ftable.setListHeader('Question Classification');
				return res;
			});
			d.addCallback(initProfile,search_catStruct);
			menuItem = getElement("searchMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;	
		case "profileBlog":
			d.addCallback(function(res){
				var ph = getElement('noteTopic');
				ph.innerHTML = kw_args.topic;
				var btn = getElement("btnSubmitProfile");
				btn.style.display = "None";
				
				var btn2 = getElement("btnCategoriesBack");
				btn2.style.display = "block";
				
				if(BrowserDetector.browser == "Explorer"){
					btn2.onclick = 'javascript:blog_classifyManuallyAbort();'
					MochiKit.Signal.connect(btn2,'onclick',blog_classifyManuallyAbort);
				}else{
					btn2.setAttribute('onClick','javascript:blog_classifyManuallyAbort();');
				}
				
				var btn3 = getElement("btnCategoriesAccept");
				
				if(BrowserDetector.browser == "Explorer"){
					btn3.onclick = 'javascript:blog_classifyManuallyAccept();'
					MochiKit.Signal.connect(btn3,'onclick',blog_classifyManuallyAccept);
				}else{
					btn3.setAttribute('onClick','javascript:blog_classifyManuallyAccept();');
				}
				
				btn3.style.display = "block";
				
				ftable.hideRating = true;

				ftable.setListHeader('Note Classification');
				return res;
			});
			d.addCallback(initProfile,kw_args.cats);
			menuItem = getElement("blogsMenuItem");
			menuItem.setAttribute("id",currentCSSClass);
			unselectQuery();
			break;
	}
	return d;
}

/**
 * Switches the content node (e.g. from search to chat)
 * 
 * @param {Object} result - the object containing the new content node html 
 */
function loadContent(result){
	replaceNode("content", result);
}

/**
 * Displays the loading screen within contentId
 */
function displayLoadingScreen(contentId){
	var div = getElement("loadingScreen");
	getElement(contentId).innerHTML = div.innerHTML;
}