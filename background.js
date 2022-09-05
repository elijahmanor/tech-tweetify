const ACCESS_TOKEN = '0d3999b046be5caa1d8ab71121073b958b5d7c7b'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getShortUrl(request.longUrl).then(shortUrl => {
    sendResponse({ shortUrl })
  })
  return true
})

async function getShortUrl(longUrl) {
  const params = {
    long_url: longUrl,
    domain: 'bit.ly'
  }
  const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify(params)
  })
  const data = await response.json()
  return data.link
}
