$(function() {
	var $log = $( "#log" );

	$('#techTweet').bind('keyup', function() {
		$('#charactersLeft').text(140 - $(this).val().length);
	});		
	
	chrome.tabs.getSelected(null, function (tab) { 								
		chrome.tabs.sendRequest(tab.id, {action: "getUserName"}, function(response) {
			var title = tab.title;
			var byAuthor = response.userName ? ' by @' + response.userName + ' ' : ' ';
			//var hashTags = '#tech ' + (response.hashTag ? '#' + response.hashTag + ' ' : '#xxx ');
			var hashTags = (response.hashTag ? '#' + response.hashTag + ' ' : '#misc' );
			$('#techTweet').val(title + byAuthor + hashTags); 
			
			var tabUrl = tab.url;
			var utmIndex = tabUrl.indexOf('?utm_source=feedburner');
			if (utmIndex > -1) {
				tabUrl = tabUrl.substr(0, utmIndex);
			}
			getAndAppendShortUrl(tabUrl);						
			
			$('#techTweet').trigger('keyup');
		});
	});		
	
	function getAndAppendShortUrl(longUrl) {
		$log.val(function( text ) { return text + "\n" + longUrl });
		chrome.extension.sendRequest({longUrl: longUrl}, function(response) {
			$log.val(function( text ) { return text + "\n" + JSON.stringify( response ) });
			var techTweet = $('#techTweet');
			var oldValue = techTweet.val();
			techTweet.val(oldValue + response.shortUrl);
			techTweet[0].focus();
			techTweet[0].select();
			techTweet.trigger('keyup');
		});				
	}	
});