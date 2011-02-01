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
 * DOM related helper functions 
 */

if(!utils){
	var utils = {};
}
utils.dom = {};

/**
 * Cuts off a input fields text content to a given length
 * 
 * @param {Object} field The input field to be cut off
 * @param {Object} maxsize The limitting text length
 */
utils.dom.limitTextSize = function(field, maxsize){
	if(field.value.length>maxsize)
		field.value = field.value.substring(0, maxsize);
}

/**
 * Converts special characters to html tags (new line -> <br/>)
 * 
 * @param {Object} text The text to be converted
 */
utils.dom.text2html = function(text){
	return text.replace(/\n/g,"<br/>");
}

/**
 * Disables a button and indicates this with an css class
 * 
 * @param {Object} btn The button to be disabled
 */
utils.dom.disableButton = function(btn){
	if(btn.length) btn = getElement(btn);
	
	btn.disabled=true;
	dojo.html.addClass(btn,'disabled');
}

/**
 * Enables buttons disabled by utils.dom.disableButton
 * @param {Object} btn The button to be enabled
 */
utils.dom.enableButton = function(btn){
	if(btn.length) btn = getElement(btn);

	btn.disabled=false;
	dojo.html.removeClass(btn,'disabled');
}