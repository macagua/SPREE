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
 * Registration related functions and objects
 */

var doValidate = true;
var formEntries = {};
var except = false;
var websites = [];
var messages = ['*','*','*','*','*'];
var strKeywords = "";
var conditionsAgreed = false;
var waitForCrawl = false;

var registration = {
	/**
	 * Select the right entry in the left side menu every time back or next was clicked.
	 * 
	 * @param {int} number Specifies which entry should be selected
	 * @param {Object} result Not used
	 * @return {Object} The result parameter 
	 */
	selectMenuitem : function(number, result){
		var items = MochiKit.DOM.getElementsByTagAndClassName("li", null, MochiKit.DOM.getElement("leftMenu"));
		for(var i=0; i< items.length; i++){
			if(i == number -1){
				items[i].style.backgroundColor = "white";
			}
			else{
				items[i].style.backgroundColor = "";
			}
		}
		return result;
	}	
};

/**
 * Called when page is switched from personal data to doc-uploading
 */
function personal2docs(){
	var ckbConditions = getElement("ckbConditions");
	if(!ckbConditions.checked){
		preferences.showTempDialog('You have to agree to the terms and conditions in order to continue!');
		return;
	}
	savePersonalForm();
	var qs = form2Querystring();
	var url = tgurl + "/registration/validateForm?nochache=";
	var d = MochiKit.Async.loadJSONDoc(url + (new Date()).getTime() + "&" + qs);
	d.addCallback(displayValidation);
}

/**
 * Called when page is switched from doc-uploading to personal data form
 */
function docs2personal(){
	var elem = getElement("txtKeywords");
	if (elem) strKeywords = elem.value;
	var d = setContent('register_new','');
	if(d == null){
		return;
	}
	d.addCallback(fillPersonalForm);
}

/**
 * Called when page is switched from doc-uploading to profile tree
 */
function docs2profile(){
	// check if all entered websites are ok
	var sitesValid = true;
	
	var btn = getElement('btnNext');
	btn.disabled = true;
	
	var txtKeywords = getElement("txtKeywords"); 
	
	var sites = [];
	var regLoadDocsForm = getElement("regLoadDocsForm");
	for(var i=0; i<regLoadDocsForm.elements.length; i++){
		sites.push(regLoadDocsForm.elements[i].value);
	}
	
	var args = {keywords:txtKeywords.value, websites:sites, nocache:(new Date()).getTime()};
	
	displayLoadingScreen('content');
	registration_loadProfile(args, 0);

	strKeywords = txtKeywords.value;
}

/**
 * Check whether new sites where crawler.
 * 
 * if all sites where crawled load tree-content.
 * else check again after some time (max 5 times)
 * 
 * @param {Object} args - the url args (keywords + websites)
 * @param {int} counter - the recursion counter
 */
function registration_loadProfile(args, counter){
	if(!counter)
		counter = 0;
	
	//var d = MochiKit.Async.loadJSONDoc("/profile/loadDocs",args);
	var d =  callManager.doRequest("profile","loadDocs", '', args);
	if(d){
		d.addCallback(
			function(res){
				//some sites were not analysed yet
				if(!res.finished && counter < 5){
					args.nocache = (new Date()).getTime();
					callLater(5, registration_loadProfile,args, counter+1);
					return false;
				}
				//all sites were analysed
				else{
					return true;
				}
			}
		);
		d.addCallback(
			function(shouldRun){
				
				//don't set new content if some sites are still missing			
				if(!shouldRun)
					return;
				
				//load tree content otherwise
				var d1 = callManager.doRequest("profile","extractNodes",null,args);
				if(d1){
					d1.addCallback(
						function(res) {
							for(x in res.status){
								for(var j=0;j<websites.length; j++){
									if(websites[j]==x){
										if(res.status[x] == ''){
											messages[j] = 'download time exceeded';
										}else{
											messages[j] = res.status[x];
										}
									}
								}
							}
							var d2 = setContent('regProfile','',{showHeaderReg:true,cats:res.rows});
							if(d2)
								d2.addCallback(function(profres){
									sitesValid = true;
									problemsWith = '';
									for(var i = 0; i<websites.length; i++){
										if(messages[i]!="ok" && messages[i]!='*' && messages[i]!=''){
											sitesValid = false;
											problemsWith += (i+1) + ',';
										}
									}
									var ph = getElement('regWebsiteStatus');
									if(sitesValid){
										ph.innerHTML = '';
									}else{
										problemsWith = problemsWith.substring(0,problemsWith.length-1);
										var ws = 'website ';
										if(problemsWith.length>1) ws = 'websites '; 
										var msg = 'Processing ' + ws;
										msg += problemsWith;
										msg += ' failed. Go back to previous page for more information.';
										ph.innerHTML = msg;
									}
								});
							return res;
						}
					);
				}
			}
		);
	}
}

/**
 * Called when page is switched from profile tree to doc-uploading
 */
function profile2docs(){
	var d = setContent('register_load_docs','');
	if(d){
		d.addCallback(populateDocFields);
		d.addCallback(displayStatus);
	}
}

/**
 * Sends all specified websites to the server for downloading.
 * Callback funtion for the response is siteFeedback()
 * 
 * @param {Object} no Not used
 */
function sendSites(no){
	websites = [];
	var regLoadDocsForm = getElement("regLoadDocsForm");
	for(var i=0; i<regLoadDocsForm.elements.length; i++){
		websites.push(regLoadDocsForm.elements[i].value);
	}
	var args = {websites:websites, nocache:(new Date()).getTime()};
	waitForCrawl = true;
	//var d = MochiKit.Async.loadJSONDoc("/profile/loadDocs",args);
	var d =  callManager.doRequest("profile","loadDocs", '', args);
	if(d) d.addCallback(siteFeedback);
}

/**
 * Processes the result of the server call in sendSites() 
 * @param {Object} result The JSON result object from /profile/loadDocs
 */
function siteFeedback(result){
	messages = result.status;
	waitForCrawl = false;
	displayStatus();
	return result;
}

/**
 * Displays status messages for each website
 */
function displayStatus(){
	for(var i=0; i<messages.length; i++){
		var td = getElement("message_website_" + (i+1));
		var inp = getElement("form_website_" + (i+1));
		if(messages[i] == "ok"){
			td.innerHTML = "*"; 
			if(inp.value!=''){
				td.innerHTML = 'ok';	
			}
		}else{
			if(messages[i] == '') td.innerHTML = '*';
			else td.innerHTML = messages[i];
		}
	}
}

/**
 * Sends the registration data as well as the profile data to the server
 * in order to register the new user
 */
function submitRegistration(){
	var listEntries = entries2AssArray();
	for(fname in formEntries){
		listEntries[fname] = formEntries[fname];
	}
	var d = setContent("register_create", '', listEntries);
	if(d){
		except = true;
		d.addCallback(fillPersonalForm);
	}
}

/**
 * Displays the needed buttons on the profile view
 * 
 * @param {Object} result Not used
 * @return {Object} The result parameter
 */
function switchButtons(result){
	var oldSubmit = getElement("btnSubmitProfile");
	oldSubmit.style.display = "None";
	var oldSubmit = getElement("btnSubmitRegistration");
	oldSubmit.style.display = "block";
	var oldSubmit = getElement("btnRegistrationBack");
	oldSubmit.style.display = "block";
	return result;
}

/**
 * Saves the data specified on the personal page 
 */
function savePersonalForm(){
	myForm = getElement("regPersonalForm");
	for(i = 0;i<myForm.elements.length;i++){
		formEntries[myForm.elements[i].name] = myForm.elements[i].value;
	} 
	var ckbConditions = getElement("ckbConditions");
	conditionsAgreed = ckbConditions.checked; 
}

/**
 * Restores the data saved by savePersonalForm()
 * 
 * @param {Object} result Not used
 * @return {Object} The result parameter
 */
function fillPersonalForm(result){
	myForm = getElement("regPersonalForm");
	if(myForm){
		for( fname in formEntries){
			if(fname != '')
				myForm.elements[fname].value = formEntries[fname];
		}
	}
	var errspan = getElement("regError");
	if(except){
		errspan.style.display='inline' ;
	}else{
		errspan.style.display = 'None';
	}
	except = false;
	var ckbConditions = getElement("ckbConditions");
	ckbConditions.checked = conditionsAgreed;
	return result;
}

/**
 * Displays validation messages if an validation error occured or
 * switches to the uploading docs view if there were no errors
 * 
 * @param {Object} result JSON result object from /registration/validateForm
 */
function displayValidation(result){
	if(result.fields && doValidate){
		fillPersonalForm(result);
		var formContainer = getElement("regPersonalForm");
		var labels = getElementsByTagAndClassName("span","fieldhelp",formContainer);
		var inputs = getElementsByTagAndClassName("input",null,formContainer);
		for(xl in labels){
			labels[xl].innerHTML = "";
			labels[xl].style.color = "#000";
		}
		for(xf in result.fields){
			var input = getElement("form_"+result.fields[xf]);
			var label = getElementsByTagAndClassName("span","fieldhelp",input.parentNode.parentNode)[0];
			label.innerHTML = result.msgs[xf];
			label.style.color = "red";
		}
	}else{

		var state = new ApplicationState('', '', '', docs2personal);
		historyManager.addState(state);
		
		var d = setContent('register_load_docs','');
		if(d){
			d.addCallback(populateDocFields);
		}
	}
	return result;
}


/**
 * Extracts all form values from the personal page form and returns
 * it as a querystring
 */
function form2Querystring(){
	var nv = MochiKit.DOM.formContents("regPersonalForm");
	var qs = MochiKit.Base.queryString(nv[0],nv[1]);
	return qs;
}

/**
 * Restores the values in the website fields
 * 
 * @param {Object} result Not used
 * @return {Object} The result parameter
 */
function populateDocFields(result){
	myForm = getElement("regLoadDocsForm");
	if(myForm){
		for(var i = 0; i<websites.length; i++){
			var field = getElement("form_website_" + (i+1));
			field.value = websites[i];
		}	
	}
	getElement("txtKeywords").value = strKeywords;
	return result;
}