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

  httpRequest.open('GET', window.location + '/' + sourceType);
  httpRequest.send(null);

  function displayData(data) {
    for (var i = 0; i < data.data.length; i++) {
      var h4 = document.createElement('h4');
      var p = document.createElement('p');
      h4.innerHTML = data.data[i].message || data.data[i].story;
      p.innerHTML = data.data[i].link;
      document.getElementById('display-source').appendChild(h4);
      document.getElementById('display-source').appendChild(p);
    }
  }

})();
