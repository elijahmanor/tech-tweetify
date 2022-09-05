$(() => {
  $('#techTweet').bind('keyup', () => {
    $('#charactersLeft').text(140 - $(this).val().length)
  })
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'getUserName' },
      async response => {
        let title = tab.title
        const byAuthor = response.userNames.length
          ? ' by @' + response.userNames[0].name + ' '
          : ' '
        if (response.userNames.length) {
          response.userNames = response.userNames.slice(1)
        }
        const hashTags = response.hashTag
          ? '#' + response.hashTag + ' '
          : '#misc'

        let cc = ''
        $.each(response.userNames, (_index, user) => {
          cc += '@' + user.name + ' '
        })
        if (cc) {
          cc = ' +' + cc
        }

        const indexOfDash = title.indexOf('-')
        const indexOfPipe = title.indexOf('|')
        const indexOfArrow = title.indexOf('\u00BB')
        if (indexOfDash > -1 || indexOfPipe > -1 || indexOfArrow > -1) {
          title =
            title.substr(0, indexOfDash) ||
            title.substr(0, indexOfPipe) ||
            title.substr(0, indexOfArrow)
          title = $.trim(title)
        }
        $('#techTweet').val(title + byAuthor + hashTags + cc)

        let tabUrl = tab.url
        const utmIndex = tabUrl.indexOf('?utm_source=feedburner')
        if (utmIndex > -1) {
          tabUrl = tabUrl.substr(0, utmIndex)
        }
        getAndAppendShortUrl(tabUrl, shortUrl => {
          const techTweet = $('#techTweet')
          const oldValue = techTweet.val()
          techTweet.val(oldValue + ' ' + shortUrl + cc)
          techTweet[0].focus()
          techTweet[0].select()
          techTweet.trigger('keyup')
        })
      }
    )
  })

  function getAndAppendShortUrl(longUrl, callback) {
    chrome.runtime.sendMessage({ action: 'getShortUrl', longUrl }, shortUrl => {
      callback(shortUrl)
    })
  }
})
