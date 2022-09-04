$(function () {
  chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
    console.log('contentScript')
    if (request.action == 'getUserName') {
      let userName = '',
        userHash = {},
        userNames = []

      $(document)
        .find(
          "a[href*='://twitter.com/'], a[href*='://www.twitter.com/'], a[href*='://twittercounter.com/']"
        )
        .each(function () {
          const twitterUrl = $(this).attr('href'),
            lastIndexOf = twitterUrl.lastIndexOf('/')

          if (twitterUrl && twitterUrl.length > 0) {
            userName = twitterUrl.substr(lastIndexOf + 1)
            if (userHash[userName]) {
              userHash[userName].count += 1
            } else {
              userHash[userName] = { name: userName, count: 1 }
            }
          }
        })

      const hashFrequency = []
      hashFrequency['jquery'] = $(
        ':contains("jQuery"), :contains("JQuery"), :contains("JQuery"), :contains("Jquery"), :contains("JQUERY")'
      ).length
      hashFrequency['aspnetmvc'] = $(
        ':contains("ASP.NET MVC"), :contains("ASP.Net MVC"), :contains("MVC")'
      ).length
      hashFrequency['aspnet'] = $(
        ':contains("ASP.NET 4.0"), :contains("ASP.Net 4.0"), :contains("WebForms"), :contains("Web Forms"), :contains("runat="server""), :contains("<asp:")'
      ).length
      hashFrequency['javascript'] = $(
        ':contains("JavaScript"), :contains("Javascript"), :contains("javascript")'
      ).length
      hashFrequency['webdev'] = $(
        ':contains("HTML"), :contains("HTML5"), :contains("CSS"), :contains("CSS3")'
      ).length
      hashFrequency['visualstudio'] = $(
        ':contains("Visual Studio"), :contains("VS")'
      ).length
      const sortedHashFrequency = sortByNumericValue(hashFrequency)

      const mostFrequentHash = (a => {
        let top = 'misc'
        for (var i in a) {
          if (a[i].c > 0) {
            top = a[i].v
            break
          }
        }
        return top
      })(sortedHashFrequency)

      for (var name in userHash) {
        userNames.push(userHash[name])
      }
      sendResponse({ userNames: userNames, hashTag: mostFrequentHash })
    } else {
      sendResponse({})
    }
  })
})

function sortByNumericValue(A) {
  var B = []
  for (let i in A) {
    B.push({ v: i, c: A[i] })
  }
  return B.sort(function (x, y) {
    return y.c - x.c
  })
}
