(function() {

  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(this.responseText);
        displayData(data);
      } else {
        console.log('Do something to handle the error');
      }
    }
  };

  httpRequest.open('GET', window.location + '/request');
  httpRequest.send(null);

  function displayData(data) {
    for (var i = 0; i < data.length; i++) {
      document.getElementById('display-source').innerHTML += '<div class="feed-item"><h4>' + (data[i].message || data[i].story) + '</h4>' + '<a href=' + data[i].link + '>Link</a></div>';
    }
  }

})();
