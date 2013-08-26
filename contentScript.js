$(function() {
	chrome.extension.onRequest.addListener(
	  function(request, sender, sendResponse) {	
		if (request.action == "getUserName")
		{
			//TODO - Change this to search for all userNames & pick most frequent
			//TODO - Ignore twitter links @home
			//TODO - Take into frequency account http://twitter.com/jglozano/statuses/12221001084 
			var searchTerm = "", twitterUrl = "", userName = "", userHash = {}, userNames = [];
			
			$(document).find( "a[href*='://twitter.com/'], a[href*='://www.twitter.com/'], a[href*='://twittercounter.com/']" ).each( function() {
				var twitterUrl = $( this ).attr( "href" ),
				lastIndexOf = twitterUrl.lastIndexOf( "/" );

				if ( twitterUrl && twitterUrl.length > 0 ) {
					userName = twitterUrl.substr( lastIndexOf + 1 );
					if ( userHash[ userName ] ) {
						userHash[ userName ].count += 1;
					} else {
						userHash[ userName ] = { name: userName, count: 1 };
					}
				}
			});
			
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
			
			for ( var name in userHash ) {
				userNames.push( userHash[ name ] );
			}			
			sendResponse({userNames: userNames, hashTag: mostFrequentHash});	  
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

