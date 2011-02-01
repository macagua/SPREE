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
 * Functions for trying to attract users attention by letting a message
 * blink in the window title
 */

if(!utils){
	var utils = {};
}
if(!utils.blinking) utils.blinking = {};

utils.blinking.message = "";
utils.blinking.doBlink = false;
utils.blinking.originalTitle = "";
utils.blinking.evtreturn = null;
 
/**
 * Let's utils.blinking.message blink in the window title.
 * utils.blinking.message has to be set before this method is called!
 */
utils.blinking.blink = function(){
	if(utils.blinking.evtreturn == null){
		utils.blinking.originalTitle = document.title;
		utils.blinking.evtreturn = MochiKit.Signal.connect(dojo.body(),
								'onmouseover',utils.blinking.stopIt);
		utils.blinking.doBlink = true;
		utils.blinking.setMessage();
	}
}

/**
 * Displays the utils.blinking.message in the window title
 * and calls utils.blinking.clearTitle through callLater
 */
utils.blinking.setMessage = function(){
	document.title = utils.blinking.message;
	if(utils.blinking.doBlink)
		callLater(0.5,utils.blinking.clearTitle);
	else{
		document.title = utils.blinking.originalTitle;
		MochiKit.Signal.disconnect(utils.blinking.evtreturn);
		utils.blinking.evtreturn = null;
	}
}

/**
 * Clears the window title and calls utils.blinking.setMessage through callLater
 */
utils.blinking.clearTitle = function(){
	document.title = "____________";
	callLater(0.2,utils.blinking.setMessage);
}

/**
 * Stops blinking.
 */
utils.blinking.stopIt = function(){
	utils.blinking.doBlink = false;
}