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
 * Get the current time as String ("hh:mm")
 */
function utils_getTimeString(){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	
	if(minutes < 10){
		minutes = "0"+minutes;
	}
	if(hours < 10){
		hours = "0"+hours;
	}
	
	return hours + ":" + minutes;
}