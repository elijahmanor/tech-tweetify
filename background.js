
    console.log( "background" );
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse)  { 
		getShortUrl(request.longUrl, function(shortUrl) { 
			sendResponse({shortUrl: shortUrl});	
		});			
    }); 
	
	function getShortUrl( longUrl, callback ) {
		getBitlyShortUrl( longUrl, function( url ) {
			callback( url );
		});
	}
	
	function getBitlyShortUrl(longUrl, callback) {
		console.log('BEGIN getShortUrl');
		var defaults = {
			version:    '2.0.1',
			login:      'elijahmanor',
			apiKey:     'R_d5a72285cd2e96eaf55d8753c6cad82e',
			history:    '0',
			longUrl:    ''
		};
		defaults.longUrl = longUrl;

		var daurl = "https://api-ssl.bitly.com/shorten?" // "https://api.bit.ly/shorten?"
			+ "version=" + defaults.version
			+ "&longUrl=" + defaults.longUrl
			+ "&login=" + defaults.login
			+ "&apiKey=" + defaults.apiKey
			+ "&history=" + defaults.history
			+ "&format=json&callback=?";

		console.log('daurl: ' + daurl);
		$.getJSON(daurl, function(data){
			console.log('BEGIN getJSON');
			var shortUrl = data.results[longUrl].shortUrl;
			console.log('shortUrl: ' + shortUrl);
			callback(shortUrl);
		});			
	}	
