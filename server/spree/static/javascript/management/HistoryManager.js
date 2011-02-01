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
 * A class for handling the forward and back button.
 * this class mainly wraps the dojo.undo.browser class.
 */
function HistoryManager(){}

/**
 * Adds an AbstractState to our and the browser's history manager
 * 
 * @param {Object} applicationState - the state to add
 */
HistoryManager.prototype.addState = function(applicationState){
	if (dojo.undo.browser.initialState == null){
		dojo.undo.browser.setInitialState(applicationState);
	}
	else{
		dojo.undo.browser.addToHistory(applicationState);
	}	
}

/**
 * Goes back to the last Content
 * 
 * @param {boolean} setInvalid - if true the current content is removed from the browser's
 * 					   history stack
 */
HistoryManager.prototype.setLastContent = function(setInvalid){
	var lastStates = dojo.undo.browser.historyStack;
	if(lastStates.length < 1){
		alert("No state to go.")
		return;
	}
	
	//set all states equal to the current state to invalid
	if(setInvalid){
		var currentState = lastStates[lastStates.length-1];
		
		var changeUrl = currentState.kwArgs["changeUrl"];
		for(var i=0; i<lastStates.length; i++){
			if(lastStates[i].kwArgs["changeUrl"] == changeUrl){
				lastStates[i].kwArgs["valid"] = false;
			}
		}
		var nextStates = dojo.undo.browser.forwardStack;
		for(var i=0; i<nextStates.length; i++){
			if(nextStates[i].kwArgs["changeUrl"] == changeUrl){
				nextStates[i].kwArgs["valid"] = false;
			}
		}
	}
	
	if(lastStates.length == 1){
		var lastState = dojo.undo.browser.initialState;
		lastState.kwArgs["back"]();		
	}
	else{
		var lastState = lastStates[lastStates.length-2];
		lastState.kwArgs["back"]();
	}
}
