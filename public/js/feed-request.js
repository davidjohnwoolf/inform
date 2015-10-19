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
      var fromField = '<h5>' + data[i].from.name + ' - ' + data[i].created_time + '</h5>';
      var messageField = '<h4>' + (data[i].message || data[i].story) + '</h4>';
      var pictureField = '';
      if (data[i].picture) {
        pictureField = '<div class="picture"><img src=' + data[i].full_picture + ' alt=' + data[i].description + '>';
      }
      var descriptionField = '';
      if (data[i].description) {
        descriptionField = '<p>' + data[i].description + '</p>';
      }
      var captionField = '';
      if (data[i].caption) {
        captionField = '<small>' + data[i].caption + '</small>';
      } else if (data[i].picture && !data[i].caption) {
        captionField = '</div>'
      }
      var linkField = '';
      if (data[i].link) {
        linkField = '<a href=' + data[i].link + ' target=_blank>' + (data[i].name || data[i].link) + '</a>';
      }

      var displayString = '<div class="feed-item">' + fromField + messageField + pictureField + linkField + descriptionField + captionField + '</div>';

      document.getElementById('display').innerHTML += displayString;
    }
  }

})();
