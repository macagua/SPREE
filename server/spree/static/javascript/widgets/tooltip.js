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
 *	Custom variables 
 */

/* Offset position of tooltip */
var x_offset_tooltip = 0;
var y_offset_tooltip = 0;

/* Don't change anything below here */

var hideQueryTooltip = false;

var ajax_tooltipObj = false;
var ajax_tooltipObj_iframe = false;

var ajax_tooltip_MSIE = false;
if(navigator.userAgent.indexOf('MSIE')>=0)ajax_tooltip_MSIE=true;

var tooltipLoadingDiv = false;

/**
 * Show the tooltip with the user data
 * 
 * @param {Object} inputObj - the object the tooltip refers to
 * @param {Object} result - the server side result providing the detailed information
 */
function ajax_showQueryTooltip(inputObj, result)
{
	var tooltipContentDiv;
	if(hideQueryTooltip){
		hideQueryTooltip = false;
		return;
	}

	tooltipContentDiv = getElement('ajax_tooltip_content');	
	tooltipContentDiv.innerHTML = result.responseText;
	
	if(ajax_tooltip_MSIE){ /* Create iframe object for MSIE in order to make the tooltip cover select boxes */
		ajax_tooltipObj_iframe = document.createElement('<IFRAME frameborder="0">');
		ajax_tooltipObj_iframe.style.position = 'absolute';
		ajax_tooltipObj_iframe.border='0';
		ajax_tooltipObj_iframe.frameborder=0;
		ajax_tooltipObj_iframe.style.backgroundColor='#FFF';
		ajax_tooltipObj_iframe.src = 'about:blank';
		tooltipContentDiv.appendChild(ajax_tooltipObj_iframe);
		ajax_tooltipObj_iframe.style.left = '0px';
		ajax_tooltipObj_iframe.style.top = '0px';
	}

 
	// Find position of tooltip
	ajax_tooltipObj.style.display='block';
	//ajax_loadContent('ajax_tooltip_content',externalFile);
	if(ajax_tooltip_MSIE){
		ajax_tooltipObj_iframe.style.width = ajax_tooltipObj.clientWidth + 'px';
		ajax_tooltipObj_iframe.style.height = ajax_tooltipObj.clientHeight + 'px';
	}

	ajax_positionTooltip(inputObj);
}

/**
 * Position the tooltip
 * 
 * @param {Object} inputObj - the object the tooltip refers to
 */
function ajax_positionTooltip(inputObj)
{
	var leftPos = (ajaxTooltip_getLeftPos(inputObj) + inputObj.offsetWidth);
	var topPos = ajaxTooltip_getTopPos(inputObj);
	if(topPos > 300){
		topPos = 300;
	}
	var tooltipWidth = document.getElementById('ajax_tooltip_content').offsetWidth;
	
	ajax_tooltipObj.style.left = leftPos + 'px';
	ajax_tooltipObj.style.top = topPos + 'px';
}

/**
 * Hide the tooltip
 */
function ajax_hideQueryTooltip(element)
{
	element.show = false;
	if(ajax_tooltipObj && ajax_tooltipObj.style){
		ajax_tooltipObj.style.display='none';
	}
	hideQueryTooltip = true;
}

/**
 * Calculate the tooltip's top position 
 * 
 * @param {Object} inputObj - the object the tooltip refers to
 */
function ajaxTooltip_getTopPos(inputObj)
{	
	var returnValue = inputObj.offsetTop + inputObj.offsetHeight + 10;
	if(y_offset_tooltip)
		returnValue += y_offset_tooltip;
	while((inputObj = inputObj.offsetParent) != null){
		if(inputObj.tagName!='HTML')returnValue += inputObj.offsetTop;
	}
	return returnValue;
}

/**
 * Calculate the tooltip's top position 
 * 
 * @param {Object} inputObj - the object the tooltip refers to
 */
function ajaxTooltip_getLeftPos(inputObj)
{
	
	var returnValue = inputObj.offsetLeft - inputObj.offsetWidth / 2 - 175;
	if(x_offset_tooltip)
		returnValue += x_offset_tooltip;
	while((inputObj = inputObj.offsetParent) != null){
		if(inputObj.tagName!='HTML')returnValue += inputObj.offsetLeft;
	}
	return returnValue;
}

/**
 * It might take some time to retrieve the infos from the server so we show 
 * a waiting tooltip which gets replace once the data arrives.
 * 
 * @param {Object} inputObj - the element we a retrieving the data for
 */
function showLoadingTooltip(inputObj){
	
	var tooltipContentDiv;

	//create tootltip object if not created yet
	if(!ajax_tooltipObj) /* Tooltip div not created yet ? */
	{
		ajax_tooltipObj = document.createElement('DIV');
		ajax_tooltipObj.style.position = 'absolute';
		ajax_tooltipObj.id = 'ajax_tooltipObj';
		document.body.appendChild(ajax_tooltipObj);	 
		  
		tooltipContentDiv = document.createElement('DIV'); /* Create tooltip content div */
		tooltipContentDiv.className = 'ajax_tooltip_content';
		ajax_tooltipObj.appendChild(tooltipContentDiv);
		tooltipContentDiv.id = 'ajax_tooltip_content';
		
		tooltipLoadingDiv = document.createElement('DIV'); /* Create tooltip content div */
		tooltipLoadingDiv.className = 'loading';
		tooltipLoadingDiv.id = 'ajax_tooltip_loading';
		
		var text = document.createElement('h1');
		text.innerHTML = "Loading user data .... (Please wait)";
		tooltipLoadingDiv.appendChild(text);	
	}
	else{
		tooltipContentDiv = getElement('ajax_tooltip_content');	
	}
	
	tooltipContentDiv.innerHTML = "";
	tooltipContentDiv.appendChild(tooltipLoadingDiv);
	
	if(ajax_tooltip_MSIE){ /* Create iframe object for MSIE in order to make the tooltip cover select boxes */
		ajax_tooltipObj_iframe = document.createElement('<IFRAME frameborder="0">');
		ajax_tooltipObj_iframe.style.position = 'absolute';
		ajax_tooltipObj_iframe.border='0';
		ajax_tooltipObj_iframe.frameborder=0;
		ajax_tooltipObj_iframe.style.backgroundColor='#FFF';
		ajax_tooltipObj_iframe.src = 'about:blank';
		tooltipContentDiv.appendChild(ajax_tooltipObj_iframe);
		ajax_tooltipObj_iframe.style.left = '0px';
		ajax_tooltipObj_iframe.style.top = '0px';
	}

 
	// Find position of tooltip
	ajax_tooltipObj.style.display='block';
	//ajax_loadContent('ajax_tooltip_content',externalFile);
	if(ajax_tooltip_MSIE){
		ajax_tooltipObj_iframe.style.width = ajax_tooltipObj.clientWidth + 'px';
		ajax_tooltipObj_iframe.style.height = ajax_tooltipObj.clientHeight + 'px';
	}

	ajax_positionTooltip(inputObj);
}

var tooltipLastDefered = null;

/**
 * Delays tooltip displaying (function doShowUserDetailsTooltip)
 * 
 * @param {Object} element - the query_element
 * @param {Object} queryID - the query_id
 * @param {int} x_offset   - the x_offset the tooltip should have to the element it is related to (can be empty)
 * @param {int} y_offset   - the y_offset the tooltip should have to the element it is related to (can be empty)
 * 
 */
function showUserDetailsTooltip(element, userID, x_offset, y_offset, isDelayed){
	element.show = true;
	callLater(0.5,doShowUserDetailsTooltip,element, userID, x_offset, y_offset);
}

/**
 * Show detailed user information in a tooltip
 * 
 * @param {Object} element - the query_element
 * @param {Object} queryID - the query_id
 * @param {int} x_offset   - the x_offset the tooltip should have to the element it is related to (can be empty)
 * @param {int} y_offset   - the y_offset the tooltip should have to the element it is related to (can be empty)
 * 
 */
function doShowUserDetailsTooltip(element, userID, x_offset, y_offset){
	if(!element.show) return;
	x_offset_tooltip = x_offset;
	y_offset_tooltip = y_offset;
	
	hideQueryTooltip = false;
	if(tooltipLastDefered)
		tooltipLastDefered.cancel();
	
	if(!ajax_tooltipObj
		|| (ajax_tooltipObj
			&& ajax_tooltipObj.style.display == 'none')) {
		showLoadingTooltip(element);
		var d = callManager.doRequest('statistics', 'getUserDetails', userID, 
			null,
			[]
		)
		if(d) 
			d.addCallback(ajax_showQueryTooltip, element);
			tooltipLastDefered = d;
	}
	
}