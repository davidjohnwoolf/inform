(function() {

  var httpRequest = new XMLHttpRequest();
  var p = document.createElement('p');

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(this.responseText);
        if (data.message) {
          var h4 = document.createElement('h4');
          h4.innerHTML = data.message;
          document.getElementById('display').appendChild(h4);
        } else {
          displayData(data);
        }
      } else {
        console.log('Do something to handle the error');
      }
    }
  };

  p.setAttribute('id', 'loading-message');
  p.innerHTML = 'Loading...';
  document.getElementById('display').appendChild(p);

  httpRequest.open('GET', window.location + '/request');
  httpRequest.send(null);


  function displayData(data) {
    document.getElementById('display').innerHTML = '';
    for (var i = 0; i < data.length; i++) {
      var date = new Date(data[i].created_time)

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours() + 1;
      var minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hours > 12) {
        hours = hours - 12;
        minutes = minutes + 'pm';
      } else {
        minutes = minutes + 'am';
      }

      var time = month + '/' + day + '/' + year + ' ' +hours + ':' + minutes;

      var fromField = '<h5><a href=https://facebook.com/' + data[i].from.id + ' target=_blank>' + data[i].from.name + '</a> - ' + time + '</h5>';

      var messageField = findLinks(data[i].message || data[i].story, 'h4');
      var pictureField = '';
      var video = '';
      if (data[i].source) {
        video = '<div class="picture"><video src=' + data[i].source + ' controls></video>'
      } else if (data[i].picture) {
        pictureField = '<div class="picture"><img src=' + data[i].full_picture + ' alt=' + data[i].description + '>';
      }
      var descriptionField = '';
      if (data[i].description) {
        descriptionField = findLinks(data[i].description, 'p');
      }
      var captionField = '';
      if (data[i].caption) {
        captionField = '<small>' + data[i].caption + '</small>';
      } else if ((data[i].picture || data[i].source) && !data[i].caption) {
        captionField = '</div>'
      }
      var linkField = '';
      if (data[i].link) {
        linkField = '<a class="main-link" href=' + data[i].link + ' target=_blank>' + (data[i].name || data[i].link) + '</a>';
      }

      var displayString = '<article class="feed-item">' + fromField + messageField + video + pictureField + linkField + descriptionField + captionField + '</article>';

      document.getElementById('display').innerHTML += displayString;
    }
  }

  function findLinks(string, element) {
    var newArray = string.split(/[ \r\n]/);
    for (var n = 0; n < newArray.length; n++) {
      if (newArray[n].slice(0, 4) === 'http') {
        newArray.splice(n, 1, '<a href=' + newArray[n] + '>' + newArray[n] + '</a>');
      }
    }
    newArray.unshift('<' + element + '>');
    newArray.push('</' + element + '>');
    return newArray.join(' ');
  }

  // searching
  var header = document.getElementById('header-wrap');
  var content = document.getElementById('content-wrap');

  var searchIcon = document.createElement('span');
  searchIcon.innerHTML = '&#9906;';
  searchIcon.setAttribute('id', 'search-icon');
  document.getElementById('right-header').appendChild(searchIcon);
  searchIcon.addEventListener('click', function() {
    if (!document.getElementById('search-container')) {
      var searchBar = document.createElement('div');
      searchBar.setAttribute('id', 'search-container');
      searchBar.innerHTML = '<input id="search" type="text" name="search" placeholder="search"><input id="search-button" type="button" value="Go">'
      document.getElementById('right-header').appendChild(searchBar);
      content.style.marginTop = header.offsetHeight + 10 + 'px';

      var searchButton = document.getElementById('search-button');
      var searchQuery = document.getElementById('search');
      searchButton.addEventListener('click', function() {
        document.getElementById('display').innerHTML = '';
        httpRequest.open('GET', window.location + '/request/' + searchQuery.value);
        httpRequest.send(null);
      });
    } else {
      var searchBar = document.getElementById('search-container');
      searchBar.parentNode.removeChild(searchBar);
      content.style.marginTop = header.offsetHeight + 10 + 'px';
    }

  });

})();
