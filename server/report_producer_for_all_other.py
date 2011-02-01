from __future__ import division
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
from sqlalchemy import *
import cPickle, string

'''
    Script that produces textual files filed with logged data.
    Intended for all other servers that have been used.
'''

db = create_engine("mysql://username:password@localhost:3306/spree_dev")

metadata = BoundMetaData(db)

query_log = Table('query_log', metadata, autoload=True)
query = Table('query', metadata, autoload=True)
r=select([query_log.c.query_id, query_log.c.user_id, query_log.c.user_name, query_log.c.status, query_log.c.created]).execute()
rows=r.fetchall()

f=open('query_report.txt', 'w')

title=['Query ID', 'User ID', 'User name', 'Status', 'Created', 'Direct', 'Modified classification', 'Text', 'Recall', 'Precision']

for t in title:
    f.write(t)
    f.write('\t')
f.write('\n')


for q_log in rows:
    d=select([query.c.isDirect,query.c.profile_subtree, query.c.profile_calculated_subtree, query.c.text],query.c.query_id==q_log.query_id).execute()
    dir=d.fetchone()
    precision=-1
    recall=-1
    for i in range(0,5):
        f.write(str(q_log[i]))
        f.write('\t')
    if dir:
        f.write(str(dir.isDirect))
    else:
        f.write('None')
    f.write('\t')
    if dir:
        t=dir.text
        t=t.rstrip()
        t=t.replace('\n',' ',40)
        t=t.replace('\r',' ',40)
        t=t.replace('\t',' ',40)
        try:
            sub=cPickle.loads(dir.profile_subtree.encode('latin1'))
            sub_cal=cPickle.loads(dir.profile_calculated_subtree.encode('latin1'))
            sub.sort()
            sub_cal.sort()
            intersec=list(set(sub).intersection(set(sub_cal)))
            if len(sub)==0:
                recall=-1
            else:
                recall=(len(intersec)/len(sub))*100
            if len(sub_cal)==0:
                precision=-1
            else:
                precision=(len(intersec)/len(sub_cal))*100
        except:
            sub=[]
            sub_cal=[]
    else:
        sub=[]
        sub_cal=[]
        t=''
    if sub!=sub_cal:
        f.write('1')
    elif sub!=[]:
        f.write('0')
    else:
        f.write('None')
    f.write('\t')
    f.write(t)
    f.write('\t')
    if (recall!=-1):
        f.write(str(recall))
    else:
        f.write('None')
    f.write('\t')
    if (precision!=-1):
        f.write(str(precision))
    else:
        f.write('None')
    f.write('\t')
        
    f.write('\n')
f.close()

user_log = Table('user_log', metadata, autoload=True)
r=select([user_log.c.user_id, user_log.c.user_name, user_log.c.login_time, user_log.c.logout_time, user_log.c.last_polling]).execute()
rows=r.fetchall()

f=open('user_report.txt', 'w')

title=['User ID', 'User name', 'Login time', 'Logout time', 'Last polling']

for t in title:
    f.write(t)
    f.write('\t')
f.write('\n')

for u_log in rows:
    for i in range(0,5):
        f.write(str(u_log[i]))
        f.write('\t')
    f.write('\n')
f.close()

chat_log = Table('chat_log', metadata, autoload=True)
r=select([chat_log.c.query_id, chat_log.c.user_id, chat_log.c.user_name, chat_log.c.user_joined, chat_log.c.expert_id,
          chat_log.c.expert_name, chat_log.c.exp_accepted, chat_log.c.who_ended, chat_log.c.chat_ended]).execute()
rows=r.fetchall()

f=open('chat_report.txt', 'w')

title=['Query ID','User ID', 'User name', 'User joined', 'Expert ID', 'Expert name', 'Expert accepted',  'Who ended', 'Chat ended']

for t in title:
    f.write(t)
    f.write('\t')
f.write('\n')

for u_log in rows:
    for i in range(0,9):
        f.write(str(u_log[i]))
        f.write('\t')
    f.write('\n')
f.close()

f=open('overall_recall_and_precision.txt','w')
recall=0
precision=0
r_count=0
p_count=0
d=select([query.c.profile_subtree, query.c.profile_calculated_subtree]).execute()
rows=d.fetchall()
for r in rows:
    try:
        sub=cPickle.loads(r.profile_subtree.encode('latin1'))
        sub_cal=cPickle.loads(r.profile_calculated_subtree.encode('latin1'))
        intersec=list(set(sub).intersection(set(sub_cal)))
        if len(sub)!=0:
            recall+=(len(intersec)/len(sub))*100
            r_count+=1
        if len(sub_cal)!=0:
            precision+=(len(intersec)/len(sub_cal))*100
            p_count+=1
    except:
        pass

recall=recall/r_count
precision=precision/p_count
f.write('Recall: ')
f.write(str(recall))
f.write('\t')
f.write('Pecision: ')
f.write(str(precision))
f.close()


