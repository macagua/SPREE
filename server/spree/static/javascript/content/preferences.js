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
 * Preferences related methods
 */

var preferences = {
	
	/**
	 * Shows the page with personal data
	 */
	showPersonal:function(){
		var d = setContent('preferences');
		/*if(d)
			d.addCallback(function(){
				dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
				dojo.html.addClass('aPrefPersonal','actionlinkSelected');
			});*/
	},
	/**
	 * Shows the settings page
	 */
	showSettings:function(){
		var d = setContent('preferencesSettings');
		/*if (d)
			d.addCallback(function(){
				dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
				dojo.html.addClass('aPrefSettings','actionlinkSelected');
			});*/
	},
	/**
	 * Shows the profile tree
	 */
	showProfile:function(){
		var d = setContent('profile',null,{showHeaderPref:true});
		/*if(d)
			d.addCallback(function(){
				dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
				dojo.html.addClass('aPrefProfile','actionlinkSelected');
			});*/
	},
	/**
	 * Removes selection from all links in header
	 */
	clearSelectedHeaders:function(){
		dojo.html.removeClass('aPrefPersonal','actionlinkSelected');
		dojo.html.removeClass('aPrefSettings','actionlinkSelected');
		dojo.html.removeClass('aPrefProfile','actionlinkSelected');
	},
	/**
	 * Function is called when user submits the personal data
	 */
	submitPersonal:function(part){
		var ct = MochiKit.DOM.formContents('preferencesContent');
		var args = {}
		for(var i = 0;i<ct[0].length;i++){
			args[ct[0][i]] = ct[1][i];
		}
		var d = setContent('preferencesUpdateUser' + part,null,args);
		if(d){
			d.addCallback(function(result){
				var inpmsg = getElement('inpmsg' + part);
				if(inpmsg.value.length>0)
					preferences.showTempDialog(inpmsg.value);
				setStatus(inpmsg.value);
				return result;
			});
		}
	},
	/**
	 * Diplays a dialog with a given text. The dialog is displayed 
	 * for 3 seconds or closed when the user clicks the OK button.
	 * 
	 * @param {String} msg The message to be displayed
	 */
	showTempDialog:function(msg){
		preferences.showDialog(msg); 
		setStatus(msg);
		callLater(3.0,preferences.closeDialog);
	},
	/**
	 * Displays a dialog with the given text
	 * @param {String} msg
	 */
	showDialog:function(msg){
		var dialog = dojo.widget.byId("dialogDynamic");
		var msgField = getElement('dialogDynamicMessage');
		msgField.innerHTML = msg;
		dialog.show();
	},
	/**
	 * Closes the dialog displayed by preferences.showDialog()
	 */
	closeDialog:function(){
		var dialog = dojo.widget.byId("dialogDynamic");
		dialog.hide();
	}
}