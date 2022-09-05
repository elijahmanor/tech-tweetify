const ACCESS_TOKEN = '0d3999b046be5caa1d8ab71121073b958b5d7c7b'

chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
  getShortUrl(request.longUrl, shortUrl => {
    sendResponse({ shortUrl })
  })
})

function getShortUrl(longUrl, callback) {
  const params = {
    long_url: longUrl,
    domain: 'bit.ly'
  }
  $.ajax({
    url: 'https://api-ssl.bitly.com/v4/shorten',
    cache: false,
    dataType: 'json',
    method: 'POST',
    contentType: 'application/json',
    beforeSend: xhr => {
      xhr.setRequestHeader('Authorization', `Bearer ${ACCESS_TOKEN}`)
    },
    data: JSON.stringify(params)
  })
    .done(data => callback(data.link))
    .fail(data => console.log('error', data))
}
