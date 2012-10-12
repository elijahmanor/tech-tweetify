console.log( "contentScript" );
$(function() {
	chrome.extension.onRequest.addListener(
	  function(request, sender, sendResponse) {	
		if (request.action == "getUserName")
		{
			//TODO - Change this to search for all userNames & pick most frequent
			//TODO - Ignore twitter links @home
			//TODO - Take into frequency account http://twitter.com/jglozano/statuses/12221001084 
			var searchTerm = "", twitterUrl = "", userName = "";
			
			if (!userName) {
				searchTerm = "http://twitter.com/";
				console.log('Searching ' + searchTerm + '...');
				twitterUrl = $(document).find("a[href^='" + searchTerm + "']:eq(0)").attr('href');
				console.log('twitterUrl: ' + twitterUrl);
				if (twitterUrl && twitterUrl.length > 0) {
					userName = twitterUrl.substr(searchTerm.length);
					console.log('userName: ' + userName);
				}
			}
			
			if (!userName) {
				searchTerm = "http://www.twitter.com/";
				console.log('Searching ' + searchTerm + '...');
				twitterUrl = $(document).find("a[href^='" + searchTerm + "']:eq(0)").attr('href');
				console.log('twitterUrl: ' + twitterUrl);
				if (twitterUrl && twitterUrl.length > 0) {
					userName = twitterUrl.substr(searchTerm.length);
					console.log('userName: ' + userName);
				}
			} 

			if (!userName) {
				searchTerm = "http://twittercounter.com/";
				console.log('Searching ' + searchTerm + '...');
				twitterUrl = $(document).find("a[href^='" + searchTerm + "']:eq(0)").attr('href');
				console.log('twitterUrl: ' + twitterUrl);
				if (twitterUrl && twitterUrl.length > 0) {
					userName = twitterUrl.substr(searchTerm.length);
					console.log('userName: ' + userName);
				}
			} 
			
			if (!userName) {
				searchTerm = "http://twittercounter.com/embed/?username=";
				console.log('Searching ' + searchTerm + '...');
				twitterUrl = $(document).find("script[src^='" + searchTerm + "']:eq(0)").attr('src');
				console.log('twitterUrl: ' + twitterUrl);
				if (twitterUrl && twitterUrl.length > 0) {
					userName = twitterUrl.substr(searchTerm.length);
					if (userName.indexOf("&") > 0) {
						userName = userName.substr(0, userName.indexOf("&"));
					}
					console.log('userName: ' + userName);
				}
			}
			console.log(twitterUrl);
			console.log(userName);
			
			//TODO - Change this to read from the options page
			var hashFrequency = [];
			hashFrequency['jquery'] = $(':contains("jQuery"), :contains("JQuery"), :contains("JQuery"), :contains("Jquery"), :contains("JQUERY")').length;
			hashFrequency['aspnetmvc'] = $(':contains("ASP.NET MVC"), :contains("ASP.Net MVC"), :contains("MVC")').length;
			hashFrequency['aspnet'] = $(':contains("ASP.NET 4.0"), :contains("ASP.Net 4.0"), :contains("WebForms"), :contains("Web Forms"), :contains("runat=\"server\""), :contains("<asp:")').length;
			hashFrequency['javascript'] = $(':contains("JavaScript"), :contains("Javascript"), :contains("javascript")').length;
			hashFrequency['webdev'] = $(':contains("HTML"), :contains("HTML5"), :contains("CSS"), :contains("CSS3")').length;
			hashFrequency['visualstudio'] = $(':contains("Visual Studio"), :contains("VS")').length;
			var sortedHashFrequency = sortByNumericValue(hashFrequency);
			for ( var i in sortedHashFrequency ) {
				console.log(sortedHashFrequency[i].v + ': ' + sortedHashFrequency[i].c);
			}
			var mostFrequentHash = (function (a) {
			   var top = 'misc'; 
			   for (var i in a) { 
					if (a[i].c > 0) {
						top = a[i].v; 
						break; 
					}				   
			   } 
			   return top; 
			})(sortedHashFrequency);
			// console.log("Most Frequent Hash: " + mostFrequentHash);
			
			sendResponse({userName: userName, hashTag: mostFrequentHash});	  
		} else {
			sendResponse({}); 
		}
	});
});

function sortByNumericValue(A) {
	var B = [];
	for (i in A) {
		B.push({v:i,c:A[i]})
    }    
    return B.sort(function(x,y) { return y.c-x.c });
}

