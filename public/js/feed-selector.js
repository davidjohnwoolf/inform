(function() {

  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(this.responseText);
        listFeeds(data);
      } else {
        console.log('Do something to handle the error');
      }
    }
  };

  var url = window.location.toString().split('/');
  console.log(url);

  httpRequest.open('GET', '/users/' + url[4] + '/feedlist');
  httpRequest.send(null);

  var headerSelect = document.getElementById('header-select');
  var userId = '';

  function listFeeds(data) {
    userId = data._id;
    for (var i = 0; i < data.feeds.length; i++) {
      var option = document.createElement('option');
      option.setAttribute('value', data.feeds[i]._id);
      option.text = data.feeds[i].title;
      headerSelect.add(option);
    }
    if (!url[7]) {
      if (!url[6] || url[6] === 'new') {
        headerSelect.value = 'select-feed'
      } else {
        var reloadButton = document.createElement('span');
        reloadButton.setAttribute('id', 'reload-button');
        reloadButton.innerHTML = '&#10227;'
        reloadButton.addEventListener('click', function() {
          window.location.reload();
        })
        document.getElementById('left-header').appendChild(reloadButton);
        headerSelect.value = url[6];
      }
    } else {
      headerSelect.value = 'select-feed';
    }
    setFeedEvents();
  }

  function setFeedEvents() {
    headerSelect.addEventListener('change', function() {
      if (this.value !== 'select-feed') {
        window.location = '/users/' + userId + '/feeds/' + this.value;
      } else {
        headerSelect.value = url[6] || 'select-feed';
      }
    });
  }

})();
