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
    The controller for the feedback content box
'''
from turbogears import controllers, expose, redirect
from turbogears import identity, config, validate, error_handler
from turbogears.database import session

from spree import json

from spree.model import User
from spree.spree_model import Feedback, FeedbackInt
import smtplib
from email.MIMEText import MIMEText

try:
    import turbomail
except ImportError:
    turbomail = None
    
class FeedbackController(controllers.Controller, identity.SecureResource):
    '''
        Handles user feedbacks.
    '''
    
    require = identity.not_anonymous();
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.feedback")
    def getFeedbackContent(self, *args, **kwargs):
        '''
            Returns content.feedback template
        '''
        
        return dict()
    
    @expose(fragment=True, content_type="text/html; charset=UTF-8", html="spree.templates.content.feedback")    
    def sendFeedback2DB(self, *args, **kwargs):    
        '''
            Stores the users feedback information to the database and sends the information
            as E-Mail to feedback.mail.receiver
        '''
        
        user = session.query(User).get_by(User.c.user_id == identity.current.user.user_id)
		
		#first: send email
        for receiver in config.get('feedback.mail.receiver'):
			self.send_email(
					receiver, 
	                user.user_name + " via " + config.get('feedback.mail.admin_email'), 
	                config.get('feedback.mail.subject.prefix') + " " + user.user_name,
	                kwargs['design'], 
	                kwargs['interaction'], 
	                kwargs['bugs'], 
	                kwargs['ideas']
	                )
	    #second: write feedback in the database
        feed = Feedback()
        feed.user_id = user.user_id
        feed.design = kwargs['design']
        feed.interaction = kwargs['interaction']
        feed.bugs = kwargs['bugs']
        feed.ideas = kwargs['ideas']

        session.save(feed)
				
        feed_int = FeedbackInt()
        feed_int.user_id = user.user_id
        feed_int.fast_registration = kwargs['fast_registration']
        feed_int.ask_many_steps = kwargs['ask_many_steps']
        feed_int.change_automatic_classification = kwargs['change_automatic_classification']
        feed_int.easy_categorization = kwargs['easy_categorization']
        feed_int.right_categorization = kwargs['right_categorization']
        feed_int.competent_expert = kwargs['competent_expert']
        feed_int.see_answer = kwargs['see_answer']
        feed_int.see_question = kwargs['see_question']
        feed_int.quick_answer = kwargs['quick_answer']
        feed_int.helpful_answer = kwargs['helpful_answer']
        feed_int.expert_online = kwargs['expert_online']
        feed_int.no_system_errors = kwargs['no_system_errors']
        feed_int.system_speed = kwargs['system_speed']
        feed_int.everyday = kwargs['everyday']
        feed_int.clear_design = kwargs['clear_design']
        feed_int.predictable_reaction = kwargs['predictable_reaction']
        feed_int.how_to_use = kwargs['how_to_use']

        session.save(feed_int)
        session.flush()

        return {}
    
    def send_email(self, to_addr, from_addr, username, design, interaction, bugs, ideas):
        '''
            Sends an email containing the information given as arguments.
            
            @param to_addr E-Mail receiver
            @param from_addr E-Mail sender
            @param username The name of the user who submitted the feedback
            @param design The users opinion about design
            @param interaction The users opinion about interaction
            @param bugs The users experiences with bugs
            @param ideas The users own ideas
        '''
        print to_addr, from_addr
        
        body = "<feedback username='" + username + "'>\n\t<design>" + design + "</design>\n" + "\t<interaction>" + interaction + "</interaction>\n" + "\t<bugs>" + bugs + "</bugs>\n\t" + "<ideas>" + ideas + "</ideas>\n</feedback>"
        # Using turbomail if it exists, 'dumb' method otherwise
        if turbomail and config.get('mail.on'):
            msg = turbomail.Message(from_addr, to_addr, username)
            msg.plain = body
            turbomail.enqueue(msg)
        else:
            msg = MIMEText (body)
            msg['Subject'] = username
            msg['From'] = from_addr
            msg['To'] = to_addr
            
            smtp_server = config.get('feedback.mail.smtp_server', 'localhost')
            smtp_port = config.get('feedback.mail.smtp_port', 25)
            
            smtp_username = config.get('feedback.mail.smtp_server.username')
            smtp_pw = config.get('feedback.mail.smtp_server.password')
            
            print smtp_username, smtp_pw
        
            smtp = smtplib.SMTP(smtp_server, smtp_port)
            if smtp_username:
                smtp.login(smtp_username, smtp_pw)
            smtp.sendmail(from_addr, to_addr, msg.as_string())
            smtp.quit()
    
    
    