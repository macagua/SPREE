import os, re

from nltk_lite import tokenize

from utils import lists
from extraction import stemmer

max_word_length = 20
base_dir = 'extraction'
filename_stopwords = 'stopwords.eng'

def loadStopwords(filepath):
	'''
		Get stopwords from stopwords file (nltk.corpus stopwords used)
	'''
	stopwords = set([line.rstrip() for line in open(filepath,"r")])
	return stopwords

def removeStopwords(grams, stopwords):
	'''
		removes all ngrams that only contain words that also appear in the stopword set
		
		@param grams: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...])
		@param stopwords: a set of stopwords 
	'''	
	new_grams = [[] for n in grams]
	for n in range(len(grams)):
		for terms in grams[n]:
			term_set = set(terms)
			non_stopwords = term_set.difference(stopwords)
			if non_stopwords:
				new_grams[n].append(terms)
			
	return new_grams

def txt2tokensOld(text):
	pattern = re.compile(r'''[a-zA-Z]+''', re.VERBOSE)
	words = list(tokenize.regexp(text.lower(), pattern))
	return words
   
def txt2tokens(text):
	'''
		Returns a list of words contained in the given text. Data not useable for
		classification is removed(e.g. non-alphanumeric characters).
	'''
	line = re.sub('[_\/\\\\\:]',' ', text)
	# remove numbers with length < 3
	line = re.sub('(^|\s)\d{1,2}($|\s)',' ', line)
	# replace non-aplhanumeric characters with space, except those which are surrounded by numbers
	#line = re.sub('(?<=\D)\W{1,59}(?=$|\D)',' ', line)
	line = re.sub('\W+(?=$|\D)',' ', line)
	line = re.sub('(?<=\D)\W+',' ', line)
	# replace duplicate spaces with one space
	line = re.sub('\s+',' ', line)

	result = []
	for w in re.split(' ', line):
		if not w == '':
		   result.append(w)

	return result

def txt2ngrams(file, max_n = 1):
	"""
		Convert a textfile to a list of n-gram lists
		
		@param file: the filename
		@param max_n: the maximal ngram size
		
		@return: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...])  
	"""
	grams = [[] for n in range(max_n)]
	
	#get words and leave rest
	import codecs

	f = codecs.open( file, "r", "latin1" )
	for line in f:#open(file,"r"):
		if line.find('km, sta')>-1:
		 print [line]
		#line = line.encode()
		#new_grams = terms2ngrams(txt2tokens(line), max_n)
		new_grams = terms2ngrams(txt2tokensOld(line), max_n)

		for i in range(max_n):
			grams[i].extend(new_grams[i])
	f.close()
	
	return grams


def terms2ngrams(terms, max_n = 3):
	'''
		Convert a list of words to a list of lists of n-grams of different size.
		This method is best called sentence wise as otherwise n-grams may include more than one sentence.
		
		@param terms: sorted list of terms as they occur in a document 
		@param max_n: look for all n_grams where n is not grater than this value
		
		@return: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...])
	'''
	grams = []
	
	for n in range(max_n):
		grams.append([])
		for term_idx in range(len(terms) - n):
			gram = map(lambda x: x.lower(), terms[term_idx:term_idx+n+1])
			grams[n].append(gram)
			
	return grams

def stemNGrams(grams):
	'''
		stem all terms given within the ngrams lists using the NLTK Porter stemmer.
		
		@param grams: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...])
		
		@return: ngrams lists with stemmed terms sorted by the n ([[1-grams...],[2-grams...],...])
	'''
	for n in range(len(grams)): 
		for i in range(len(grams[n])):
			for j in range(len(grams[n][i])):
				grams[n][i][j] = stemmer.stem(grams[n][i][j])
			
	return grams

def grams2Strings(grams):
	'''
		Convert each ngram list of strings the one string using whitespaces as separators
		
		@param grams: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...]) each ngram given as list of strings
		
		@return: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...]) each ngrams given as string with whitespace separator
	'''
	for n in range(len(grams)): 
		for i in range(len(grams[n])):
			grams[n][i] = " ".join(grams[n][i])
			
	return grams

def getNGramsHistograms(ngrams):
	'''
		Accumulate equal ngrams genarating historgrams.
		
		@param ngrams: ngrams lists sorted by the n ([[1-grams...],[2-grams...],...]) each ngrams given as string with whitespace separator
	
		@return: a list of ngram dictionaries sorted by the n ([{1-grams:count...},{2-grams:count...},...])
	'''
	for n in range(len(ngrams)):
		ngrams[n] = lists.listToHistogram(ngrams[n])
		
	return ngrams
	
def filterRareGrams(histograms, min_count = 2):
	'''
		Filter all ngrams that occur less often than a given limit
		
		@param histograms: a list of ngram dictionaries sorted by the n ([{1-grams:count...},{2-grams:count...},...])
	
		@return: (a filtered list of ngram dictionaries sorted by the n ([{1-grams:count...},{2-grams:count...},...]),
				  list with the number of items that where filtered per ngram type)
	'''
	filtered_items = [0] * len(histograms)
	for n in range(len(histograms)):
		for term, count in histograms[n].items():
			if count < min_count or len(term) > max_word_length *(n+1):
				del histograms[n][term]
				filtered_items[n] += count
				
	return (histograms, filtered_items)

def filterRareTerms(bow, min_count = 2):
	'''
		Filter all terms that occur less often than a given limit
		
		@param bow: a dictionary with (term,count) as key-value pair
	
		@return: a filtered dictionary
	'''
	result = {}
	for (term,count) in bow.items():
		n = len(term.split(' '))
		if count >= min_count and len(term) <= max_word_length * n:
			result[term] = count 
				
	return result

def file2bow(filepath, n=3):
	grams = txt2ngrams(filepath, n)
	grams = removeStopwords(grams, loadStopwords(os.path.join(base_dir, filename_stopwords)))
	grams = stemNGrams(grams)
	grams = grams2Strings(grams)
	grams = getNGramsHistograms(grams)
	#grams = filterRareGrams(grams, 2)[0]
	#merged = grams[0]
	#for i in range(1,n):
	#	merged.update(grams[i])

	#print filepath, len(merged)
	#return merged
	return grams

if __name__ == "__main__":
	filename = 'sample.doc.txt'
	