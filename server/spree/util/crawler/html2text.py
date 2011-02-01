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
    Functionality for downloading html and convert it to a text file
'''

'''
    html2text: Turn HTML into equivalent Markdown-structured text.
'''
__version__ = "2.25"
__author__ = "Aaron Swartz (me@aaronsw.com)"
__copyright__ = "(C) 2004 Aaron Swartz. GNU GPL 2."
__contributors__ = ["Martin 'Joey' Schulze", "Ricardo Reyes"]

# TODO:
#   Support decoded entities with unifiable.
#	Relative URL resolution

if not hasattr(__builtins__, 'True'): True, False = 1, 0
import re, sys, urllib, htmlentitydefs, codecs, StringIO, types
import sgmllib
sgmllib.charref = re.compile('&#([xX]?[0-9a-fA-F]+)[^0-9a-fA-F]')

filebuffer = ""

try: from textwrap import wrap
except: pass

# Use Unicode characters instead of their ascii psuedo-replacements
UNICODE_SNOB = 0

# Put the links after each paragraph instead of at the end.
LINKS_EACH_PARAGRAPH = 0

# Wrap long lines at position. 0 for no wrapping. (Requires Python 2.3.)
BODY_WIDTH = 0

### Entity Nonsense ###

def name2cp(k):
    '''
        @todo: fill in
    '''    
    if k == 'apos': return ord("'")
    if hasattr(htmlentitydefs, "name2codepoint"): # requires Python 2.3
		return htmlentitydefs.name2codepoint[k]
    else:
		k = htmlentitydefs.entitydefs[k]
		if k.startswith("&#") and k.endswith(";"): return int(k[2:-1]) # not in latin-1
		return ord(codecs.latin_1_decode(k)[0])

unifiable = {'rsquo':"'", 'lsquo':"'", 'rdquo':'"', 'ldquo':'"', 
'copy':'(C)', 'mdash':'--', 'nbsp':' ', 'rarr':'->', 'larr':'<-', 'middot':'*',
'ndash':'-', 'oelig':'oe', 'aelig':'ae',
'agrave':'a', 'aacute':'a', 'acirc':'a', 'atilde':'a', 'auml':'a', 'aring':'a', 
'egrave':'e', 'eacute':'e', 'ecirc':'e', 'euml':'e', 
'igrave':'i', 'iacute':'i', 'icirc':'i', 'iuml':'i',
'ograve':'o', 'oacute':'o', 'ocirc':'o', 'otilde':'o', 'ouml':'o', 
'ugrave':'u', 'uacute':'u', 'ucirc':'u', 'uuml':'u'}

unifiable_n = {}

for k in unifiable.keys():
	unifiable_n[name2cp(k)] = unifiable[k]

def charref(name):
    '''
        @todo: fill in
    '''
    if name[0] in ['x','X']:
		c = int(name[1:], 16)
    else:
		c = int(name)
	
    if not UNICODE_SNOB and c in unifiable_n.keys():
		return unifiable_n[c]
    else:
		return unichr(c)

def entityref(c):
    '''
        @todo: fill in
    '''
    
    if not UNICODE_SNOB and c in unifiable.keys():
		return unifiable[c]
    else:
		try: name2cp(c)
		except KeyError: return "&" + c
		else: return unichr(name2cp(c))

def replaceEntities(s):
    '''
        @todo: fill in
    '''
    
    s = s.group(1)
    if s[0] == "#": 
		return charref(s[1:])
    else: return entityref(s)

r_unescape = re.compile(r"&(#?[xX]?(?:[0-9a-fA-F]+|\w{1,8}));")
def unescape(s):
    '''
        @todo: fill in
    '''
    
    try:
		return r_unescape.sub(replaceEntities, s)
    except:
		s = s.decode('latin1')
		return r_unescape.sub(replaceEntities, s)
	
def fixattrs(attrs):
    '''
        @todo: fill in
    '''
    
	# Fix bug in sgmllib.py
    if not attrs: return attrs
    newattrs = []
    for attr in attrs:
		newattrs.append((attr[0], unescape(attr[1])))
    return newattrs

### End Entity Nonsense ###

def onlywhite(line):
	'''
        Checks if line consists only of white spaces.

        @param line: line to be examined
        @return: true if line has white spaces only
	'''
	
	for c in line:
		if c is not ' ' and c is not '	':
			return c is ' '
	return line

def optwrap(text):
	'''
        Wraps all paragraphs in the provided text.
        @todo: fill in
        @param text:
        @return:
    '''
    
	if not BODY_WIDTH:
		return text
	
	assert wrap # Requires Python 2.3.
	result = ''
	newlines = 0
	for para in text.split("\n"):
		if len(para) > 0:
			if para[0] is not ' ' and para[0] is not '-' and para[0] is not '*':
				for line in wrap(para, BODY_WIDTH):
					result += line + "\n"
				result += "\n"
				newlines = 2
			else:
				if not onlywhite(para):
					result += para + "\n"
					newlines = 1
		else:
			if newlines < 2:
				result += "\n"
				newlines += 1
	return result

def hn(tag):
    '''
        @todo: fill in
    '''
    if tag[0] == 'h' and len(tag) == 2:
		try:
			n = int(tag[1])
			if n in range(1, 10): return n
		except ValueError: return 0

class _html2text(sgmllib.SGMLParser):
    '''
        @todo: fill in
    '''
    
    def __init__(self, out=sys.stdout.write):
        sgmllib.SGMLParser.__init__(self)
		
        if out is None: self.out = self.outtextf
        else: self.out = out
        self.outtext = u''
        self.quiet = 0
        self.p_p = 0
        self.outcount = 0
        self.start = 1
        self.space = 0
        self.a = []
        self.astack = []
        self.acount = 0
        self.list = []
        self.blockquote = 0
        self.pre = 0
        self.startpre = 0
        self.lastWasNL = 0
	
	def outtextf(self, s): 
	    '''
            @todo: fill in
        '''
        try:
        	if type(s) is type(''): s = codecs.utf_8_decode(s)[0]
        	self.outtext += s
        except:
        	pass
		
	def close(self):
	    '''
            @todo: fill in
        '''
        
        sgmllib.SGMLParser.close(self)
        
        self.pbr()
        self.o('', 0, 'end')
        
        return self.outtext
		
	def handle_charref(self, c):
	    '''
            @todo: fill in
        '''
        
        self.o(charref(c))

	def handle_entityref(self, c):
	    '''
            @todo: fill in
        '''
        
        self.o(entityref(c))
			
	def unknown_starttag(self, tag, attrs):
	    '''
            @todo: fill in
        '''
        
        self.handle_tag(tag, attrs, 1)
	
	def unknown_endtag(self, tag):
	    '''
            @todo: fill in
        '''
        
        self.handle_tag(tag, None, 0)
		
 	def previousIndex(self, attrs):
 		'''
            Servs the index of certain set of attributes (of a link) in the
 			a list, or none if the attribute is not found.
 			@todo: fill in
 			@param attrs:
            @return:
        '''
        
 		if not attrs.has_key('href'): return None
 		
 		i = -1
 		for a in self.a:
 			i += 1
 			match = 0
 			
 			if a.has_key('href') and a['href'] == attrs['href']:
 				if a.has_key('title') or attrs.has_key('title'):
 						if (a.has_key('title') and attrs.has_key('title') and
						    a['title'] == attrs['title']):
 							match = True
 				else:
 					match = True

 			if match: return i

    def handle_tag(self, tag, attrs, start):
        attrs = fixattrs(attrs)
	
        if hn(tag):
        	self.p()
        	if start: self.o(hn(tag)*"#" + ' ')
        
        if tag in ['p', 'div']: self.p()
        
        if tag == "br" and start: self.o("  \n")
        
        if tag == "hr" and start:
        	self.p()
        	self.o("* * *")
        	self.p()
        
        if tag in ["head", "style", 'script']: 
        	if start: self.quiet += 1
        	else: self.quiet -= 1
        
        if tag == "blockquote":
        	if start: 
        		self.p(); self.o('> ', 0, 1); self.start = 1
        		self.blockquote += 1
        	else:
        		self.blockquote -= 1
        		self.p()
        
        if tag in ['em', 'i', 'u']: self.o("_")
        if tag in ['strong', 'b']: self.o("**")
        if tag == "code" and not self.pre: self.o('`') #TODO: `` `this` ``
        
        if tag == "a":
            if start:
                attrsD = {}
                for (x, y) in attrs: attrsD[x] = y
                attrs = attrsD
                if attrs.has_key('href') and False: 
                	self.astack.append(attrs)
                	self.o("[")
                else:
                	self.astack.append(None)
            else:
				if self.astack:
					a = self.astack.pop()
					if a:
						i = self.previousIndex(a)
						if i is not None:
							a = self.a[i]
						else:
							self.acount += 1
							a['count'] = self.acount
							a['outcount'] = self.outcount
							self.a.append(a)
						self.o("][" + `a['count']` + "]")
		
        if tag == "img" and start:
        	attrsD = {}
        	for (x, y) in attrs: attrsD[x] = y
        	attrs = attrsD
        	if attrs.has_key('src'):
        		attrs['href'] = attrs['src']
        		alt = attrs.get('alt', '')
        		i = self.previousIndex(attrs)
        		if i is not None:
        			attrs = self.a[i]
        		else:
        			self.acount += 1
        			attrs['count'] = self.acount
        			attrs['outcount'] = self.outcount
        			self.a.append(attrs)
        		self.o("![")
        		self.o(alt)
        		self.o("]["+`attrs['count']`+"]")
		
		if tag == 'dl' and start: self.p()
		if tag == 'dt' and not start: self.pbr()
		if tag == 'dd' and start: self.o('    ')
		if tag == 'dd' and not start: self.pbr()

		if tag in ["ol", "ul"]:
			if start:
				self.list.append({'name':tag, 'num':0})
			else:
				if self.list: self.list.pop()
			
			self.p()
		
		if tag == 'li':
			if start:
				self.pbr()
				if self.list: li = self.list[-1]
				else: li = {'name':'ul', 'num':0}
				self.o("  "*len(self.list)) #TODO: line up <ol><li>s > 9 correctly.
				if li['name'] == "ul": self.o("* ")
				elif li['name'] == "ol":
					li['num'] += 1
					self.o(`li['num']`+". ")
				self.start = 1
			else:
				self.pbr()
		
		if tag in ['tr']: self.pbr()
		
		if tag == "pre":
			if start:
				self.startpre = 1
				self.pre = 1
			else:
				self.pre = 0
			self.p()
			
	def pbr(self):
	    '''
            @todo: fill in
        '''
        
        if self.p_p == 0: self.p_p = 1

	def p(self): self.p_p = 2
        '''
            @todo: fill in
        '''
	
    def o(self, data, puredata=0, force=0):
		if not self.quiet: 
			if puredata and not self.pre:
				data = re.sub('\s+', ' ', data)
				if data and data[0] == ' ':
					self.space = 1
					data = data[1:]
			if not data and not force: return
			
			if self.startpre:
				#self.out(" :") #TODO: not output when already one there
				self.startpre = 0
			
			bq = (">" * self.blockquote)
			if not (force and data and data[0] == ">") and self.blockquote: bq += " "
			
			if self.pre:
				bq += "    "
				data = data.replace("\n", "\n"+bq)
			
			if self.start:
				self.space = 0
				self.p_p = 0
				self.start = 0

			if force == 'end':
				# It's the end.
				self.p_p = 0
				self.out("\n")
				self.space = 0


			if self.p_p:
				self.out(('\n'+bq)*self.p_p)
				self.space = 0
				
			if self.space:
				if not self.lastWasNL: self.out(' ')
				self.space = 0

			if self.a and ((self.p_p == 2 and LINKS_EACH_PARAGRAPH) or force == "end"):
				if force == "end": self.out("\n")

				newa = []
				for link in self.a:
					if self.outcount > link['outcount']:
						self.out("   ["+`link['count']`+"]: " + link['href']) #TODO: base href
						if link.has_key('title'): self.out(" ("+link['title']+")")
						self.out("\n")
					else:
						newa.append(link)

				if self.a != newa: self.out("\n") # Don't need an extra line when nothing was done.

				self.a = newa

			self.p_p = 0
			self.out(data)
			self.lastWasNL = data and data[-1] == '\n'
			self.outcount += 1

    def handle_data(self, data):
		self.o(data, 1)
	
    def unknown_decl(self, data):
        pass


def wrapwrite(text):
    '''
        @todo: fill in
    '''
    
    sys.stdout.write(text.encode('utf8'))

def html2text_file(html, out=wrapwrite):
    '''
        @todo: fill in
    '''
    h = _html2text(out)
    h.feed(html)
    h.feed("")
    return h.close()
		

def html2text(html):
    '''
        @todo: fill in
    '''
        
    return optwrap(html2text_file(html, None))

def simpleHtml2text(html):
	'''
		Removes all lines starting with "<".
		@todo: fill in
		@param:html:
        @return:
	'''
	
	txt = ""
	for line in html.split("\n"):
		if not line.strip().startswith("<"):
			txt += line +"\n"
	return txt

 
def html2txt(address):
	if not address.startswith("http://"):
		address = "http://" + address
	
	user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2) Gecko/20070219 Firefox/2.0.0.2'
	import urllib2, socket
		
	#try:
		# set timeout to avoid urllib2 from blocking
	timeout = 20		
	socket.setdefaulttimeout(timeout)
	req = urllib2.Request(address, None, {'User-Agent':user_agent})
	f = urllib2.urlopen(req)
	html = f.read()
	try:
		text = html2text(html)
	except:
		text = simpleHtml2text(html)
	f.close()
	return (True, text)
