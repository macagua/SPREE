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
 * The manager responsible for frequently polling the server for new data.
 */
function PollingManager(){
	
	// the registered functions
	this.functions = [];
	
	// the counter
	this.counter = 0;
	
	// last time the user clicked or pressed a key
	this.lastActivityTime = new Date().getTime();
	
	// the min update interval
	this.minInterval = 4;
	
	this.maxInterval = 1;
	
	// the current update interval
	this.currentInterval = this.minInterval;
	
	this.shouldPoll = true;
}

/**
 * Simulate an user action. This is used e.g. when the chat partner is active.
 */
PollingManager.prototype.resetInterval = function(){
	this.lastActivityTime = new Date().getTime();
	this.currentInterval = this.minInterval;
}

/**
 * The polling interval. This is correlated with the time without user activity
 */
PollingManager.prototype.getInterval = function(){
	var interval = this.minInterval;
	
	if(this.lastActivityTime > 0){
		interval = (new Date().getTime() - this.lastActivityTime) / 1000;
	}
	interval = Math.max(Math.round(Math.pow(interval * 0.05, 0.5)), this.minInterval);
	interval = Math.min(this.maxInterval, interval);
	
	this.displayInterval(interval);
	return interval;
}

/**
 * Call all registered functions
 */
PollingManager.prototype.callAll = 	function(){
	var callRegular = this.counter % this.currentInterval == 0
	
	for (var i = 0; i < this.functions.length; i++){
		if(this.maxInterval > 1 && this.functions[i].maxInterval){
			// if the function has a custom maxInterval we consider that
			var interval = Math.min(this.functions[i].maxInterval, this.currentInterval);
			if(this.counter % interval == 0){
				this.functions[i](this.counter / interval);
			}
		}else{
			if(callRegular){
				this.functions[i](this.counter / this.currentInterval);
			}
		}
	}
}
/**
 * Add a function to the call stack
 * 
 * @param {Object} func - the function to add to the call stack
 */
PollingManager.prototype.addFunction = 	function(func){
	this.functions.push(func);
}

/**
 * Start the polling loop.
 */
PollingManager.prototype.run = function(){
	//if(this.counter % this.currentInterval == 0){
	this.update();
	
	this.currentInterval = this.getInterval();
	//}
	this.counter = this.counter + 1;
	
	if(pollingManager.shouldPoll){
		callLater(1, polling_start);	
	}
}
/**
 * Start the polling loop.
 */
function polling_start(){
	pollingManager.run();
}

/**
 * Displays the current polling interval to the user.
 * 
 * @param {Object} interval - the interval in seconds
 */
PollingManager.prototype.displayInterval = function(interval){
	var elem = getElement("polling_interval");

	if(elem){
		elem.removeChild(elem.childNodes[0]);
		elem.appendChild(document.createTextNode("Interval: " + interval + "s " + new Date().getTime()));
	}
}

/**
 * Call all registered functions
 */
PollingManager.prototype.update = function(){
											this.callAll();											
									}

/**
 * Each time a user is active by clicking or key pressing we remember the time
 * so that the update interval can be adaptad to the users activity
 */
PollingManager.prototype.rememberUserActivity = function(){
													var time = new Date().getTime();
													if(this.lastActivityTime + this.minInterval < time){
														
														//trigger an update
														this.currentInterval = this.minInterval;
													}
													this.lastActivityTime = time;
												}			

/**
 * Stops polling
 */
PollingManager.prototype.stop = function(){
	this.shouldPoll = false;
}