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
* ApplicationState is an object that represents the application state.
* It will be given to dojo.undo.browser to represent the current application state.
* 
* @param type - the state's content type
* @param args - the arguments for the given content (i.e. the id of the chat, slash, separated)
* @param kwargs - the arguments for the given content (json object)
* @param loadFunction - the function to be called when an back/forward button is clicked
*/
ApplicationState = function(type, args, kwargs, loadFunction){
	//the content type
	this.type = type;
	//the args for the content 
	this.args = args ? args : null;
	//the params for the content 
	this.kwargs = kwargs ? kwargs : null;

	this.changeUrl=true;
	//the function that will be called each time a the user goes for- or backward
	this.loadFunction = loadFunction;
	
	//this state is valid
	this.valid = true;

}

/**
 * dojo.undo.browser whenever user clicks back button
 */
ApplicationState.prototype.back = function(){
	if(this.valid)
		this.loadFunction(this.type,this.args, this.kwargs);
}

/**
 * dojo.undo.browser whenever user clicks fwd button
 */
ApplicationState.prototype.forward = function(){
	if(this.valid)
		this.loadFunction(this.type,this.args, this.kwargs);
}

/**
 * Sets this state to invalid, i.e. it is not considered during navigation
 */
ApplicationState.prototype.setInvalid = function(){
	this.valid = false;
}