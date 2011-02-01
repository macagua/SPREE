Create a taxonomy for SPREE - the knowledge exchange network and train a TFIDF classifier.
The classifier is trained using search engines for the retrieval of category characteristic documents.

This script requires Python >=2.4, the libraries required by SPREE and the httplib2 library.

In order to create your own taxonomy and train the classifier please do the following:

1. Download the latest spree open source distribution.
2. Create a folder structure somewhere in your file system equal to the taxonomy structure whith the folder names equal to the category names

	A folder structure could look similar to this:
	
	Computers
	|- Software
	|- Hardware
	Sports
	|- Soccer
	|- Tennis
	|- ...
	
	Please keep in mind that the folder names will be used to query the Yahoo! search API and therefore have to be representative. 
	Try to avoid folders like "applications, games, tools" or "other".
3. Get a Yahoo! application ID in order to use the Yahoo! Search API and add it to the settings.py file. (see http://developer.yahoo.com/search/ for details)
4. Start crawling Yahoo! using the addYahooSites.py this will query Yahoo! by folder names and store the obtained urls in each folder.
4. Use the crawler.py and start crawling the first X obtained urls from the web and store all retrieved files as *.txt files in the corresponding folders. 
	You may specify X in the settings.py. In our tests a X of 20 proved sufficient as later results are often of lower quality.
	Some files may not be crawled the first time you try but you can run the script as often as you want to get the remaining sites.
5. Start training the classifier and exporting the resulting nodes and term weights using the exportTree.py. 
	You should obtain 2 packed cPickle files named (nodes.cpkl.bz2 and terms.cpkl.bz2) containing the taxonomy structure and the term weights.
6. Copy these two files to your SPREE open source distribution to the 'data/ontology' folder overwriting the existing files.
7. Setup SPREE and create a database as described here: http://spree.dai-labor.de/documentation/initial_steps/
8. Start the spree server in "development" mode ("python start-spree.py"). This will load the taxonomy to the database.
9. Connect to spree (default http://localhost:8080). And login to the system. 
	If you use the standard scripts you should already have a list of registered users (e.g. "robert":"password")
10. Ask a question about something that should occur in your taxonomy and click on "Search Expert".
	Yout should see the categories suggested by SPREE for the query. Clicking on "Modify" should show you your new taxonomy.
11. As this is no productive code yet...I wish you good luck!