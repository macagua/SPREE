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
 * Loads dojo and mochikit packages and defines alias names
 */

/**
 * Load MochiKit and needed dojo packages
 * 
 */
dojo.registerModulePath("mk", tgurl + "/static/javascript/libs/MochiKit");
dojo.require("MochiKit.MochiKit");
/*dojo.require("dojo.lang.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Tree");
dojo.require("dojo.widget.TreeSelector");
dojo.require("dojo.widget.TreeNode");
dojo.require("dojo.widget.TreeRPCController");
dojo.require("dojo.widget.FilteringTable");
dojo.require("dojo.widget.Dialog");
dojo.require("dojo.widget.TitlePane");
dojo.require("dojo.undo.browser");*/
dojo.hostenv.writeIncludes();
	
/** 
 * Alias names for MochiKit functions
 * 
 */
var addLoadEvent = MochiKit.DOM.addLoadEvent;
var getElement = MochiKit.DOM.getElement;
var hideElement = MochiKit.Style.hideElement;
var appear = MochiKit.Style.appear;
var callLater = MochiKit.Async.callLater;
var doSimpleXMLHttpRequest = MochiKit.Async.doSimpleXMLHttpRequest;
var loadJSONDoc = MochiKit.Async.loadJSONDoc;
var appear = MochiKit.Visual.appear;
var toggle = MochiKit.Visual.toggle;
var getElementsByTagAndClassName = MochiKit.DOM.getElementsByTagAndClassName;

