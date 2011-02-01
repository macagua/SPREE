'''
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
	
'''
'''
    The constants that are used in application are kept here.
'''

n_max_experts = 5 #spree_model-->findExperts : number of experts contacted for given query , input variable
n_max_blogs = 5  #spree_model-->findRelatedBlogs : number of related blogs for a given query , input variable
n_of_blogs_per_page = 5 #subcontrollers.blog_controller-->getBlogsContent : number of blogs per page , local variable limit
n_of_chats_per_page = 5 #subcontrollers.chat_controller-->getChatOverviewContent : number of chats per page , local variable limit
max_openQueries = 5 #subcontrollers.statistics_controller-->getUserDetailsSub, number of opened queries, local variable limit
                    #subcontrollers.im_controller-->getUserDetails : number of opened queries, local variable limit
                    #subcontrollers.im_controller-->doDirectChat : number of opened queries                                doDirectChat
                    #subcontrollers.search_controller-->global : number of opened queries, variable limit
most_active_n_of_ranks = 5 #subcontrollers.statistics_controller-->getHighscoreList : number of top most active experts
no_imusers_per_page = 20

isOnlineExpire = 20 # time in seconds before recalculating the online status of a user
rankExpire = 10     # time in seconds before recalculating all user ranks

#layout

#tagcloud
tagcloud_minfont = 10
tagcloud_font = 12
tagcloud_maxfont = 20
value_level_1 = 4
value_level_2 = 2
