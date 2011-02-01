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
 * Feedback related functions
 */

/**
 * Send the feedback to the server and sets the new content.
 */
function feedback_send(){
	var subject = MochiKit.DOM.getElement("feedbackcontent_subject").value;
	var text = MochiKit.DOM.getElement("feedbackcontent_text").value;	
	
	if (subject.length + text.length < 5){
		feedback_showDialog();
		return;
	}

	var sendButton = MochiKit.DOM.getElement("feedbackcontent_sendButton");
	sendButton.disabled = true;
	
	// send the feedback
	var d = callManager.doRequest('feedback', 'send', null, 
			{"subject": subject,
				"text": text},
			[function(result){
				feedback_show_dialog(); 
				callLater(3.0,feedback_close_dialog); 
			}]
	)
	// never forget to check this!!
	if(d == null){
		return;
	}
}

/**
 * Send the feedback to the serverDB and via MAIL and sets the new content.
 */
function feedback_send2DB(){
	
	//these are the fields where the user can give own comments.
	var design = MochiKit.DOM.getElement("feedbackcontent_design").value;
	var interaction = MochiKit.DOM.getElement("feedbackcontent_interaction").value;
	var bugs = MochiKit.DOM.getElement("feedbackcontent_bugs").value;
	var ideas = MochiKit.DOM.getElement("feedbackcontent_ideas").value;
	
	var sum = 0;
	// these are the variables for the questions with radiobuttons
	var fields = {"fast_registration":0,
				"ask_many_steps":0,
				"change_automatic_classification":0,
				"easy_categorization":0,
				"right_categorization":0, 
				"competent_expert":0,
				"see_answer":0,
				"see_question":0,
				"quick_answer":0,
				"helpful_answer":0,
				"expert_online":0,
				"no_system_errors":0,
				"system_speed":0,
				"everyday":0,
				"clear_design":0,
				"predictable_reaction":0,
				"how_to_use":0};
	
	//which field is checked?
	for(fieldname in fields) {
		
		for (var i=0; i< document.form[fieldname].length; i++)  { 
			if (document.form[fieldname][i].checked)  {		
				fields[fieldname] = document.form[fieldname][i].value;	
			} 
		} 
		sum = sum + fields[fieldname];
	}
	
	//add to the dic the textfield
	fields["design"] = design;
	fields["interaction"] = interaction;
	fields["bugs"]= bugs;
	fields["ideas"]= ideas;

	//if every field is empty than show a warning
	if (design.length < 2 && interaction.length < 2 && ideas.length < 5  && bugs.length < 5 && sum == "000000000000000000000"){
		feedback_showDialog();
		return;
	}

	var sendButton = MochiKit.DOM.getElement("feedbackcontent_sendButton");
	sendButton.disabled = true;
	

	// send the feedback2DB_and_Email
	// in fields are all variables which will send.
	//send2DB --> function in callmanager	
	var d = callManager.doRequest('feedback', 'send2DB', null, fields, 
			[function(result){
				feedback_show_dialog(); 
				callLater(3.0,feedback_close_dialog); 
			}]
			         
	)
	
	// never forget to check this!!
	if(d == null){
		return;
	}
}



/**
 * If there isn't enough information shows the dialog.
 */
function feedback_showDialog(){
	var dialog = dojo.widget.byId("Dialog_feedback");
	dialog.show();
}


/**
 * Closes the dialog.
 */
function feedback_closeDialog(){
	var dialog = dojo.widget.byId("Dialog_feedback");
	dialog.hide();
}


/**
 * Shows the dialog after the sending of feedback to SPREE.
 */
function feedback_show_dialog(){
	var dialog = dojo.widget.byId("dialogFeedback");
	dialog.show();
}


/**
 * Closes the dialog.
 */
function feedback_close_dialog(){
	var dialog = dojo.widget.byId("dialogFeedback");
	var	ds = dialog.shared.bg.style.display != "none";
	if(ds){
		var dialog = dojo.widget.byId("dialogFeedback");
		dialog.hide();
		setContent("search");
	}
}
