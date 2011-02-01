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
 * Helper functions for working with arrays
 */

if(!utils){
	var utils = {};
}
if(!utils.arrays) utils.arrays = {};

 
/**
 * Determines if item is element of array arr
 * @param {Object} arr The array to iterate over
 * @param {Object} item The item to look for
 */
utils.arrays.contains = function(arr, item){
	if(arr){
		for(var i=0; i<arr.length; i++){
			if(arr[i]==item) return true;
		}
	}
	return false;
}

/**
 * Returns true iff arr1 is subset of arr2
 * @param {Object} arr1
 * @param {Object} arr2
 */
utils.arrays.isSubset = function(arr1, arr2){
	if(!arr1 || !arr2){
		return false;
	}
	
	for(var i=0; i<arr1.length; i++){
			if(!utils.arrays.contains(arr2,arr1[i])) return false;
	}
	return true;
}