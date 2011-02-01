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
 * The call manager manages all requests.
 * 
 * It is responsible for:
 * 
 * - avoid sending multiple times the same request before a response arrives
 * - set a timeout to each request
 * - cancel request if the user is not interested anymore (only used for content switches)
 */
var callManager = {
	
	// cancel all calls after X seconds
	timeout  : 20,
	
	//when no entry arrived for this time span in ms we considerer us disconnected
	disconnectedDelay : 300000,
	
	// all request (Deferred objects) are stored here
	// content is always stored as key 'content'
	// other stuff is stored with it's id
	requests : [],
	
	lastResponseArrivalTime : new Date().getTime(),
	
	// all data needed for a request except the dynamic arguments
	// id: 		unique identifier
	// type: 	main category (i.e. chat)
	// subtype: sub category (i.e. send (type: chat))
	// url: url of the request withou dynamic arguments
	// format: 'json'|'xmlhttp'
	call_data: [
		// chat
		{
			id: '1',
			type: 'chat',
			sub_type: 'getEntries',
		 	url: '/content/chat/getAllEntries/',
			format: 'json'
		},
		{
			id: '2',
			type: 'chat',
		 	sub_type: 'send',
			url: '/content/chat/send/',
			format: 'json'
		},
		{
			id: '3',
			type: 'chat',
			sub_type: 'finish',
			url: '/content/chat/finish/',
			format: 'json'
		},
		{
			id: '4',
			type: 'chat',
			sub_type: 'rate',
			url: '/content/chat/rate/',
			format: 'json'
		},
		{
			id: '11',
			type: 'box',
			sub_type: 'io',
			url: '/boxes/getQueries',
			format: 'json'
		},	
		{
			id: '13',
			type: 'box',
			sub_type: 'statistics',
			url: '/boxes/getStatistics',
			format: 'xmlhttp'
		},
		// content
		{
			id: '21',
			type: 'content',
			sub_type: 'search',
			url: '/content/search/getSearchContent',
			format: 'xmlhttp'
		},	
		{
			id: '22',
			type: 'content',
			sub_type: 'waitSearch',
			url: '/content/search/getWaitSearchContent/',
			format: 'xmlhttp'
		},			
		{
			id: '23',
			type: 'content',
			sub_type: 'blogs',
			url: '/content/blog/getBlogsContent/',
			format: 'xmlhttp'
		},			
		{
			id: '24',
			type: 'content',
			sub_type: 'blogentry',
			url: '/content/blog/getBlogEntryContent/',
			format: 'xmlhttp'
		},		
		{
			id: '25',
			type: 'content',
			sub_type: 'blog_content_edit',
			url: '/content/blog/getBlogEditContent/',
			format: 'xmlhttp'
		},	
		{
			id: '26',
			type: 'content',
			sub_type: 'profile',
			url: '/content/getProfileComponent',
			format: 'xmlhttp'
		},	
		{
			id: '27',
			type: 'content',
			sub_type: 'statistics',
			url: '/content/getStatisticsComponent',
			format: 'xmlhttp'
		},	
		{
			id: '28',
			type: 'content',
			sub_type: 'chat',
			url: '/content/chat/join/',
			format: 'xmlhttp'
		},	
		{
			id: '28',
			type: 'content',
			sub_type: 'allquestions',
			url: '/content/search/getAllOpenQuestionsContent/',
			format: 'xmlhttp'
		},	
		{
			id: '31',
			type: 'content',
			sub_type: 'query_overview',
			url: '/content/search/getQueryOverviewContent/',
			format: 'xmlhttp'		
		},
		{
			id: '32',
			type: 'content',
			sub_type: 'register_load_docs',
			url: '/registration/getRegisterLoadDocs',
			format: 'xmlhttp'
		},
		{
			id: '33',
			type: 'content',
			sub_type: 'register_new',
			url: '/registration/new',
			format: 'xmlhttp'
		},
		{
			id: '34',
			type: 'content',
			sub_type: 'regProfile',
			url: '/content/getProfileComponent',
			format: 'xmlhttp'
		},
		{
			id: '35',
			type: 'content',
			sub_type: 'register_create',
			url: '/registration/create',
			format: 'xmlhttp'
		},
		{
			id: '36',
			type: 'content',
			sub_type: 'register_lost_password',
			url: '/registration/lost_password',
			format: 'xmlhttp'
		},
		{
			id: '37',
			type: 'content',
			sub_type: 'chat_overview',
			url: '/content/chat/getChatOverviewContent',
			format: 'xmlhttp'
		},	
		{
			id: '38',
			type: 'content',
			sub_type: 'feedback',
			url: '/content/feedback/getFeedbackContent/',
			format: 'xmlhttp'			
		},
		{
			id: '39',
			type: 'content',
			sub_type: 'preferences',
			url: '/content/getPreferencesComponent',
			format: 'xmlhttp'
		},
		{
			id: '40',
			type: 'content',
			sub_type: 'preferencesSettings',
			url: '/profile/getSettingsContent',
			format: 'xmlhttp'
		},
		{
			id: '41',
			type: 'content',
			sub_type: 'preferencesUpdateUser1',
			url: '/registration/update_user1',
			format: 'xmlhttp'
		},
		{
			id: '411',
			type: 'content',
			sub_type: 'preferencesUpdateUser2',
			url: '/registration/update_user2',
			format: 'xmlhttp'
		},	
		{
			id: '42',
			type: 'content',
			sub_type: 'profileSearch',
			url: '/content/getProfileComponent',
			format: 'xmlhttp'
		},
		{
			id: '43',
			type: 'blog',
			sub_type: 'do_BlogPost',
			url: '/content/blog/do_BlogPost',
			format: 'json'
		},
		{
			id: '44',
			type: 'profile',
			sub_type: 'extractNodes',
			url: '/profile/extractNodes',
			format: 'json'
		},
		{
			id: '45',
			type: 'content',
			sub_type: 'profileBlog',
			url: '/content/getProfileComponent',
			format: 'xmlhttp'
		},
		{
			id: '46',
			type: 'blog',
			sub_type: 'updateBlogCategories',
			url: '/content/blog/updateBlogCategories',
			format: 'json'
		},
		{
			id: '47',
			type: 'profile',
			sub_type: 'getNodesInfo',
			url: '/profile/getNodesInfo',
			format: 'json'
		},
		{
			id: '48',
			type: 'feedback',
			sub_type: 'send2DB',
			url: '/content/feedback/sendFeedback2DB/',
			format: 'xmlhttp'			
		},
		{
			id: '49',
			type: 'content',
			sub_type: 'im_expertFull',
			url: '/content/im/directChatFull/',
			format: 'xmlhttp'
		},
		{
			id: '50',
			type: 'blog',
			sub_type: 'deleteBlogEntry',
			url: '/content/blog/deleteBlogEntry/',
			format: 'json'
		},
		{
			id: '51',
			type: 'blog',
			sub_type: 'doBlogRating',
			url: '/content/blog/doBlogRating/',
			format: 'json'
		},
		{
			id: '52',
			type: 'chat',
			sub_type: 'rate',
			url: '/content/chat/rate/',
			format: 'json'
		},
		{
			id: '53',
			type: 'profile',
			sub_type: 'getExpertise',
			url: '/profile/getExpertise/',
			format: 'json'
		},
		{
			id: '54',
			type: 'profile',
			sub_type: 'loadDocs',
			url: '/profile/loadDocs/',
			format: 'json'
		},
		{
			id: '101',
			type: 'search',
			sub_type: 'doQuery',
			url: '/content/search/doQuery',
			format: 'json'			
		},
		
		{
			id: '102',
			type: 'search',
			sub_type: 'doDecline',
			url: '/content/search/doDecline/',
			format: 'json'			
		},
		
		{
			id: '103',
			type: 'search',
			sub_type: 'getExpertsStatus',
			url: '/content/search/getExpertsStatus/',
			format: 'json'			
		},		
		{
			id: '104',
			type: 'search',
			sub_type: 'getQueryStatus',
			url: '/content/search/getQueryStatus/',
			format: 'json'			
		},		
		{
			id: '105',
			type: 'feedback',
			sub_type: 'send',
			url: '/content/feedback/sendFeedback/',
			format: 'json'			
		},		
		{
			id: '106',
			type: 'search',
			sub_type: 'getKeywords',
			url: '/content/search/getKeywords/',
			format: 'json'			
		},		
		{
			id: '107',
			type: 'search',
			sub_type: 'getKeywordsAndCategories',
			url: '/content/search/getKeywordsAndCategories/',
			format: 'json'			
		},
		{
			id: '108',
			type: 'search',
			sub_type: 'deleteQuery',
			url: '/content/search/deleteQuery/',
			format: 'json'			
		},
		{
			id: '109',
			type: 'search',
			sub_type: 'getUsers',
			url: '/content/search/getUsers/',
			format: 'json'			
		},
		{
			id: '110',
			type: 'im',
			sub_type: 'doDirectChat',
			url: '/content/im/doDirectChat',
			format: 'json'
		},			
		{
			id: '111',
			type: 'content',
			sub_type: 'im',
			url: '/content/im/getImContent/',
			format: 'xmlhttp'
		},
		{
			id: '112',
			type: 'im',
			sub_type: 'getUsers',
			url: '/content/im/getUsers/',
			format: 'xmlhttp'
		},
		{
			id: '113',
			type: 'im',
			sub_type: 'getUserDetails',
			url: '/statistics/getUserDetailsIM/',
			format: 'xmlhttp'
		},
		{
			id: '114',
			type: 'statistics',
			sub_type: 'getUserDetails',
			url: '/statistics/getUserDetailsForTooltip/',
			format: 'xmlhttp'
		},
		{
			id: '115',
			type: 'statistics',
			sub_type: 'getHighscoreList',
			url: '/statistics/getHighscoreList/',
			format: 'xmlhttp'
		},
		{
			id: '116',
			type: 'profile',
			sub_type: 'update_setting',
			url: '/profile/update_setting',
			format: 'json'
		}
	],
	
	// nothing to do here
	init: function(){},
	
	// get the dataset to a given type, sub_type combination
	getData: function(type, sub_type){
		for (var i=0;i<this.call_data.length;i++)	{
			var data = this.call_data[i];
			if(data.type == type && (data.sub_type == '' || data.sub_type == sub_type))
				return data;
		}
		
		alert('CallManager: no data for ' + type + " " + sub_type);
		return null;
	},
	
	// does a request for the given type, sub_type combination adding optional arguments
	// type: 		see call_data.type
	// sub_type: 	see call_data.sub_type
	// url_args:	String, args passed as part of the url divided by '/' or 'null'
	// kw_args:		Dict, args passed as parameters ({name: 'robert'} -> ?name='robert') or 'null'
	// callbacks:	[], array of callback functions
	doRequest: function(type, sub_type, url_args, kw_args, callbacks){
		var data = this.getData(type, sub_type);
		
		var id = data.id;
		
		// all content is concurrent
		// therefore we dont use the call id but store every created request as 'content'
		if(type == 'content'){
			id = 'content';
		}
		
		// the last request of the same type
		var oldRequest = this.requests[id];
		
		if (oldRequest != null){
			// no result returned yet ... 
			if(oldRequest.fired == -1){
				// content replaces old requests
				if(id == 'content'){
					oldRequest.cancel();				
				}
				// other request don't replace but have to wait
				// till the previous request returns or timeouts
				else{
					return null;
				}
			}
		}
		
		var newRequest;
		
		if(url_args == null){
			url_args = '';
		}
		
		var kwArgs = {}
		if(kw_args != null){
			kwArgs = kw_args;
		}
		// always add timestamp to avoid browser side caching 
		kwArgs['nocache'] = (new Date()).getTime();
		
		var strArgs = MochiKit.Base.queryString(kwArgs);
		
		urlprefix = tgurl;
		if(urlprefix.charAt(tgurl.length-1) == '/' && data.url.charAt(0) == '/' ){
			urlprefix = urlprefix.substring(0,urlprefix.length-1);
		}
		url = urlprefix + data.url;
		if(strArgs.length>999){
			switch(data.format){
				case 'json':
					d = this.doPostJSON( url + url_args,strArgs);
					break;
				case 'xmlhttp':
					d = this.doPostXML( url + url_args,strArgs);
					break;
			}
		}else{
			switch(data.format){
				case 'json':
					d = MochiKit.Async.loadJSONDoc(url + url_args,kwArgs);
					break;
				case 'xmlhttp':
					d = doSimpleXMLHttpRequest(url + url_args,kwArgs);
					break;
			}
		}
		// remember request
		this.requests[id] = d;
		
		if(d != null){
			
			d.addErrback(function(res){
				var currentTime = new Date().getTime();
				//alert(currentTime + " " + callManager.lastResponseArrivalTime + " " + callManager.disconnectedDelay);
				
				// if error and server did not response since a long time we stop the application
				// asking the user to refresh when the connection is back
				// this probably only ocurs when the internet connection is lost or when the server
				// is heavily overloaded
				if(currentTime - callManager.lastResponseArrivalTime > callManager.disconnectedDelay){
					pollingManager.stop();
					var dialog = dojo.widget.byId("Dialog_Disconnected");
					dialog.show();
				}
				return res;
			});
			//set timeout
			var timer = callLater(this.timeout, d.cancel);
			d.addCallback(function (res) { timer.cancel(); return res;});
			
			//remember when we last had a connection to the server
			d.addCallback(function (res) {
				callManager.lastResponseArrivalTime = new Date().getTime();
				return res;
			});
			
			//add callback methods
			if(callbacks != null){
				for (var i=0;i<callbacks.length;i++){
					d.addCallback(callbacks[i]);
				}
			}
		}
		
		//return the Deferred object so callbacks can still be added
		return d;
	},
	
	/**
	 * Performs a POST XMLHttpRequest
	 * @param {Object} url The target URL
	 * @param {String} args The arguments in queryString format
	 */
	doPostXML:function(url, args){
		options = {'method':'POST',
					'sendContent':args,
					"headers": {"Content-Type": "application/x-www-form-urlencoded"}}
		return MochiKit.Async.doXHR(url,options);
	},
	
	/**
	 * Performs a POST JSON Request
	 * @param {Object} url The target URL
	 * @param {String} postVars The arguments in queryString format
	 */
	doPostJSON:function(url, postVars){
		var mk = MochiKit.Async;
		var req = mk.getXMLHttpRequest();
	    req.open("POST", url, true);
	    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    //var data = queryString(postVars);
	    var d = mk.sendXMLHttpRequest(req, postVars);
	    return d.addCallback(mk.evalJSONRequest);
	}
}

