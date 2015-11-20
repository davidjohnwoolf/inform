// parse strings and turn urls into links
function findLinks(string) {
  // seperate string into array by spaces and returns
  var wordArray = string.split(/[ \r\n]/);

  // loop through array and turn url into anchor tag
  for (var n = 0; n < wordArray.length; n++) {
    if (wordArray[n].slice(0, 4) === 'http') {
      wordArray.splice(n, 1, '<a href=' + wordArray[n] + ' target=_blank>' + wordArray[n] + '</a>');
    }
  }

  return wordArray.join(' ');
}

module.exports = findLinks;
