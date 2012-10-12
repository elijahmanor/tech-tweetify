$(function() {
	$('#techTweet').bind('keyup', function() {
		$('#charactersLeft').text(140 - $(this).val().length);
	});		
	
	chrome.tabs.getSelected(null, function (tab) { 								
		chrome.tabs.sendRequest(tab.id, {action: "getUserName"}, function(response) {
			var title = tab.title;
			var byAuthor = response.userNames.length ? ' by @' + response.userNames[0].name + ' ' : ' ';
			if ( response.userNames.length ) {
				response.userNames = response.userNames.slice( 1 );
			}
			var hashTags = (response.hashTag ? '#' + response.hashTag + ' ' : '#misc' );

			var cc = "";
			$.each( response.userNames, function( index, user ) {
				cc += "@" + user.name + " ";
			}); 
			if ( cc ) {
				cc = " +" + cc;
			}
			$('#techTweet').val(title + byAuthor + hashTags); 
			
			var tabUrl = tab.url;
			var utmIndex = tabUrl.indexOf('?utm_source=feedburner');
			if (utmIndex > -1) {
				tabUrl = tabUrl.substr(0, utmIndex);
			}
			getAndAppendShortUrl(tabUrl, function( shortUrl ) {
				var techTweet = $('#techTweet');
				var oldValue = techTweet.val();
				techTweet.val(oldValue + shortUrl + cc);
				techTweet[0].focus();
				techTweet[0].select();
				techTweet.trigger('keyup');
			});									
		});
	});		
	
	function getAndAppendShortUrl(longUrl, callback) {
		chrome.extension.sendRequest({longUrl: longUrl}, function(response) {
			callback( response.shortUrl );
		});				
	}	
});