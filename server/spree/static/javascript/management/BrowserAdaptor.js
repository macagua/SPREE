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
 * Some Browser have known CSS bug.
 * Bugs treated here are:
 * 
 * 	- overflow: visible is unknown in IE < v7
 * 
 */
BrowserAdaptor = {
	adapt: function(){
		if (BrowserDetector.isIElt7()){
			var boxElems = MochiKit.DOM.getElementsByTagAndClassName(null, "box", document);
			for (var i=0; i< boxElems.length; i++){
				boxElems[i].style.overflow = "hidden";
			}
		}
	}
}