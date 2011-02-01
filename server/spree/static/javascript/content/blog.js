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
 * Blog related functions
 */

var blogs_classifyBack = 'blogs';
var blogs_classifyBackParam = '-1';

/**
 * Loads the blog overview content.
 */
function blogLoadContent(){
	setContent('blogs','-1');
}


/**
 * Performs a server call in order to delete a blog entry
 * 
 * @param {Object} blogentry_id The id of the blog entry to be deleted
 */
function deleteBlogEntry(blogentry_id){
	//d = loadJSONDoc("/content/blog/deleteBlogEntry/"+blogentry_id,{"nocache": (new Date()).getTime()});
	d = callManager.doRequest("blog","deleteBlogEntry",blogentry_id + '',null);
	d.addCallback(function(result){
		blogLoadContent();
		setStatus("NoteBook entry was deleted.");
	})
}

/**
 * Sends a new blog to the server.
 */
function blogentry_save(){
	var title = getElement("blogentry_topic").value;
	var text = getElement("blogentry_text").value;	
	var id = getElement("blog_entry_id").value;
	var privat = getElement("blogentry_check").checked;
	var query_id = getElement("queryId").value;
		
	if(title.length == 0){
		createBlog_showDialog();
		return;
	}
			
	var createButton = MochiKit.DOM.getElement("blogentry_createButton");
	createButton.disabled = true;
		
	d = callManager.doRequest("blog","do_BlogPost",null,
			{"blogentry_id":id,
			"title": title,
			"text": text,
			"private": privat,
			"query_id": query_id,
			"nocache": (new Date()).getTime()});	
		
	if(d){
		d.addCallback(function(result){
			//alert('a');
			setStatus("Saved notebook entry.");
			if (id>0){
				setContent('blogentry',id+'/'+0+'/'+0)
			}
			else{
				blogLoadContent()
			}
       });
	}
}


/**
 * Resets all fields of the blogentry form
 */
function blogentry_clearFields(){
	MochiKit.DOM.getElement("blogentry_topic").value = "";
	MochiKit.DOM.getElement("blogentry_text").value = "";	
	MochiKit.DOM.getElement("blogentry_check").checked = false;
}


/**
 * Shows the dialog box for blog rating.
 */
function blog_rate_showDialog(blogentry_id){
	current_blogentry_id = blogentry_id;
	var dialog = dojo.widget.byId("DialogContent_blog");
	var btn = document.getElementById("blog_dialog_hider");
	dialog.setCloseControl(btn);
	dialog.show();
}

/**
 * Cancels the blog rating process.
 */
function blog_rate_cancelDialog(){
	var dialog = dojo.widget.byId("DialogContent_blog");
	dialog.hide();
} 


/**
 * Saves the rating for the given blog
 * 
 * @param {int} blogentry_id The rating of the blog entry identified by this id will be saved 
 */
function blog_rate(blogentry_id){
	var e = MochiKit.DOM.getElement("blog_rating_radio_1");
	var buttons =[];
	var query_id = getElement("queryId_after_rate").value;
	
	for (var i=1;i<6; i++){
		buttons[i-1] = MochiKit.DOM.getElement("blog_rating_radio_" + i);

	}
	
	for(i=0;i<buttons.length; i++){
		if(buttons[i].checked == true){
			//d = loadJSONDoc("/content/blog/doBlogRating/" + blogentry_id + "/" + buttons[i].value,{"nocache": (new Date()).getTime()});
			d = callManager.doRequest("blog","doBlogRating",blogentry_id + "/" + buttons[i].value,null);
			d.addCallback(function(result){
				
				setStatus("Saved new Rating." );
				setContent('blogentry',blogentry_id+'/'+1+'/'+ query_id);
				})
		 	 }
	      getElement("no_rate_blog").style.display = "";
		  getElement("rate_blog").style.display = "none";	
		  	
	}
	unselectQuery(true);
}

/**
 * Displays the profile tree allowing the user to modify the categories
 * Takes the topic and a variable number of node ids as arguments which define 
 * the preselected nodes.
 * e.g. blog_modifyCategories(entryID, topic, 116,87)
 * 
 * @param {int} entryID Identifies the blog entry
 * @param {String} topic The topic of the blog
 * @param {int} [optional] ID's of the blogs current categories
 */
function blog_modifyCategories(entryID,topic/*,...*/){
	knownArgs = 2;
	labelOffset = arguments.length-knownArgs;
	
	var pres = []
	for(var i = knownArgs; i < labelOffset+knownArgs; i++){
		pres.push(arguments[i]);
	}
	var d = callManager.doRequest('profile','getNodesInfo','',{nodeids:pres});
	if(d)
		d.addCallback(function(res){
			pres = res.infos;
			var args = {showHeaderBlog:true,cats:pres,topic:topic,entryID:entryID};
			setContent('profileBlog',null,args,true);
	});
}

/**
 * Setter for blogs_classifyBack and blogs_classifyBackParam
 * @param {Object} func New value for blogs_classifyBack
 * @param {Object} param New value for blogs_classifyBackParam
 */
function blogs_setBackFunction(func,param){
	blogs_classifyBack = func;
	blogs_classifyBackParam = param;
}

/**
 * Called when manual modifications should not be applied.
 * Returns to notebook overview.
 */
function blog_classifyManuallyAbort(){
	return setContent(blogs_classifyBack,blogs_classifyBackParam);
}

/**
 * Called when manual modifications should be applied.
 * Applies changes and returns to notebook overview.
 */
function blog_classifyManuallyAccept(){
	var hiddenID = getElement('hiddenEntryID');
	var args = {};
	args.blogentry_id = hiddenID.value;
	args.catIDs = [];
	cats='';
	for(var i = 0; i < ftable.data.length; i++){
		if(ftable.data[i].id){
			args.catIDs.push(ftable.data[i].id);
			cats += ftable.data[i].label + ', ';
		}
	}
	
	var d = callManager.doRequest('blog','updateBlogCategories',null,args);
	if(d){
		d.addCallback(function(res){
			d2 = blog_classifyManuallyAbort();
			d2.addCallback(function(res){
				var entrycats = getElement('entryCats_' + hiddenID.value);
			if(cats!='')
				entrycats.innerHTML = cats.slice(0,cats.length-2);
			});
		});
	}
}


/**
 * Displays the chat in the textarea.
 */
function blogedit_addChat(){
	getElement("blogentry_text").value +=  "\n" + getElement("blogentry_chatText").value;
}


/**
 * If there isn't enough information about the new blog this dialog is displayed.
 */
function createBlog_showDialog(){
	var dialog = dojo.widget.byId("Dialog_createBlog");
	dialog.show();
}


/**
 * Closes the dialog.
 */
function createBlog_closeDialog(){
	var dialog = dojo.widget.byId("Dialog_createBlog");
	dialog.hide();
}
