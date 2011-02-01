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
    Provides email related functions
'''
import smtplib
from email.MIMEText import MIMEText
from turbogears import config

try:
    import turbomail
except ImportError:
    turbomail = None

def send_email(to_addr, subject, body):
    '''
        Send an email.
        
        @param to_addr: the recipient
        @param subject: the subject
        @param body: the message body (text or html)   
    '''
    
    from_addr = config.get('registration.mail.admin_email')
    try:
        # Using turbomail if it exists, 'dumb' method otherwise
        if turbomail and config.get('mail.on'):
            msg = turbomail.Message(from_addr, to_addr, subject)
            msg.plain = body
            turbomail.enqueue(msg)
        else:        
            smtp_server = config.get('registration.mail.smtp_server', 'localhost')
            smtp_port = config.get('registration.mail.smtp_server_port', 25)
            smtp_username = config.get('registration.mail.smtp_server.username', None)
            smtp_pw = config.get('registration.mail.smtp_server.password', None)
            
            msg = MIMEText (body)
            msg.set_charset('utf-8')
            msg['Subject'] = subject
            msg['From'] = from_addr
            msg['To'] = to_addr
        
            smtp = smtplib.SMTP(smtp_server, smtp_port)
            if smtp_username:
                smtp.login(smtp_username, smtp_pw)
            smtp.sendmail(from_addr, to_addr, msg.as_string())
            smtp.quit()
            print "send email to %s" % to_addr
    except:
        print "Could not send email to %s (%s)" % (to_addr, subject)