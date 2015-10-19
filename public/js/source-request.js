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
    for (var i = 0; i < data.data.length; i++) {
      document.getElementById('display-source').innerHTML += '<div class="feed-item"><h5>' + data.data[i].from.name + ' - ' + data.data[i].created_time + '</h5><h4><a href=' + data.data[i].link + ' target="_blank">' + (data.data[i].message || data.data[i].story) + '</a></h4><img src=' + data.data[i].picture + ' alt=' + data.data[i].description + '><h5>' + data.data[i].description + '</h5></div>';
    }
  }

})();
