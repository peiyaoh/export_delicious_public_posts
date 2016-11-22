var request = require('request');
var htmlparser = require("htmlparser");
var select = require('soupselect').select;
var fs = require('fs');

// parameters to set

// username of the user
var user_name = "public";

// maximum number of public posts to retrieve. Set it to the total number of public posts of that user to retrieve all the public posts.
var max_entry_count =100;

// number of milliseconds to wait before getting the next batch. Set it to a number larger or equal to 2000.
var waitMSeconds = 2000;

// variables for the application
var page_index = 1;
var myURL;
var myInterval;
var bookmark_list = [];
var job_list = [];
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
			
			console.log("Posts in this batch: " + entries.length);
			
			entries.forEach(function(entry) {
				
				var bookmark = {};
				
				var entry_date = entry.attribs['date'];
				var entry_title = select(entry, '.articleTitlePan h3 a.title')[0].attribs['title'];
				var entry_link = select(entry, '.articleInfoPan p a')[0].attribs['href'];
				
				var entry_text_entity_list = select(entry, '.thumbTBriefTxt p p');
				var entry_description = "";
				if( entry_text_entity_list.length > 0){
					entry_description = entry_text_entity_list[0].children[0].data;
				}
				console.log(JSON.stringify(entry_description) );
				var entry_tags_raw = select(entry, '.thumbTBriefTxt .tagName li a');
				
				var entry_tags = [];

				for( var i = 0; i < entry_tags_raw.length; i++){
					entry_tags.push(entry_tags_raw[i].children[0].raw);
				}
				
				bookmark.date = entry_date;
				bookmark.title = entry_title;
				bookmark.description = entry_description;
				bookmark.link = entry_link;
				bookmark.tags = entry_tags.join();
				
				bookmark_list.push(bookmark);
				
				console.log("Bookmark index: " + bookmark_list.length);
			});
			
			page_index++;
			
			if(entries.length > 0){
				// add one more page
				job_list.push("https://del.icio.us/" + user_name + "?&page=" + page_index);
			}
			else{
				myStopFunction();
			}
			
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
	myInterval = setInterval(function(){ getOnePage() }, waitMSeconds);
	// add one more page
	job_list.push("https://del.icio.us/" + user_name + "?&page=" + page_index);
};

function writeBookmarks(){
	html_whole = html_header;
	var bookmark;
	
	for( var i = 0; i < bookmark_list.length; i++){
		bookmark = bookmark_list[i];
		var html_element = "<DT><A HREF=\"" + bookmark.link + "\" ADD_DATE=\"" + bookmark.date + "\" TAGS=\""+bookmark.tags+"\">" + bookmark.title + "</A>\n<DD>" + bookmark.description + "\n";
		html_whole += html_element;
	}
	
	html_whole += html_footer;
			
	fs.writeFile("./"+ user_name +"_bookmarks.html", html_whole, function(err) {
		if(err) {
			return console.log(err);
		}}
	);

	console.log("The bookmarks file was saved!");
};

function getOnePage() {
	console.log("# bookmarks: " + bookmark_list.length);
	
	if(bookmark_list.length >= max_entry_count){
		myStopFunction();
		return;
	}
	
	if( job_list.length > 0 ){
		myURL = job_list.shift();
		var options = {
		  url: myURL,
		  headers: myHeaders
		};
		console.log("Request: " + myURL);
		request(options, callback);
	}
	
	
}

function myStopFunction() {
	console.log("Stop - # bookmarks: " + bookmark_list.length);
    clearInterval(myInterval);
	writeBookmarks();
}

startExporting();