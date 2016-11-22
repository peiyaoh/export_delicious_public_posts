var request = require('request');
var htmlparser = require("htmlparser");
var select = require('soupselect').select;
var fs = require('fs');

// parameters to set

// username of the user
var user_name = "public";

// total number of posts of that user
var max_entry_count = 3;

// number of batch to obtain. Set it to max_entry_count/10 + 1
var max_page = 1;

// number of milliseconds to wait before getting the next batch. Set it to a number larger or equal to 1000.
var waitMSeconds = 1000;

// variables for the application
var page_index = 1;
var entry_count = 0;
var myURL;
var myInterval;
var bookmark_list = [];
var hteml_whole = "";
var html_header = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n";
var html_footer = "</DL><p>";

var myHeaders = {
	"Content-type": "application/x-www-form-urlencoded",
	"Host": "del.icio.us",
	"Connection": "keep-alive",
	"Discourse-Track-View": "true",
	"Accept": "*.*, q=0.1",
	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
	"Referer": "https://del.icio.us/",
	"Accept-Encoding": "deflate, scdh"
};

var convertContentToBookmarks = function(content){
	
	var handler = new htmlparser.DefaultHandler(function(err, dom) {
		if (err) {
			console.debug("Error: " + err);
		} else {

			var entries = select(dom, 'div.articleThumbBlockOuter');
			
			entries.forEach(function(entry) {
				//console.log(JSON.stringify(entry) );
				var bookmark = {};
				
				var entry_date = entry.attribs['date'];
				var entry_title = select(entry, '.articleTitlePan h3 a.title')[0].attribs['title'];
				var entry_link = select(entry, '.articleInfoPan p a')[0].attribs['href'];
				var entry_tags_raw = select(entry, '.thumbTBriefTxt .tagName li a');
				
				var entry_tags = [];

				for( var i = 0; i < entry_tags_raw.length; i++){
					entry_tags.push(entry_tags_raw[i].children[0].raw);
				}
				
				bookmark.date = entry_date;
				bookmark.title = entry_title;
				bookmark.link = entry_link;
				bookmark.tags = entry_tags.join();
				
				bookmark_list.push(bookmark);
				
				entry_count++;
				console.log("Entry count: " + entry_count);
			})
		}
	});

	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(content);
	
};

var print = function(pURL, pHeaders, content){
	convertContentToBookmarks(content);
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    convertContentToBookmarks(body);
  }
}

var startExporting = function(){
	myInterval = setInterval(function(){ myTimer() }, waitMSeconds);
};

function writeBookmarks(){
	html_whole = html_header;
	var bookmark;
	
	for( var i = 0; i < bookmark_list.length; i++){
		bookmark = bookmark_list[i];
		var html_element = "<DT><A HREF=\"" + bookmark.link + "\" ADD_DATE=\"" + bookmark.date + "\" TAGS=\""+bookmark.tags+"\">" + bookmark.title + "</A>\n";
		html_whole += html_element;
	}
	
	html_whole += html_footer;
			
	fs.writeFile("./bookmarks.html", html_whole, function(err) {
		if(err) {
			return console.log(err);
		}}
	);

	console.log("The bookmarks file was saved!");
};

function myTimer() {
	
	if( page_index <= max_page){
		myURL = "https://del.icio.us/" + user_name + "?&page=" + page_index
		
		var options = {
		  url: myURL,
		  headers: myHeaders
		};
		
		request(options, callback);
		
		page_index++;
	}
	else if(entry_count < max_entry_count){
		// do nothing, waitng for more links to return
	}
	else{
		myStopFunction();
	};
}

function myStopFunction() {
    clearInterval(myInterval);
	writeBookmarks();
}

startExporting();