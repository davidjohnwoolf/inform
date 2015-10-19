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
      var date = new Date(data[i].created_time)

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours() + 1;
      var minutes = date.getMinutes();
      if (hours > 12) {
        hours = hours - 12;
        minutes = minutes + 'pm';
      } else {
        minutes = minutes + 'am';
      }

      var time = month + '/' + day + '/' + year + ' ' +hours + ':' + minutes;

      var fromField = '<h5>' + data[i].from.name + ' - ' + time + '</h5>';

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

      var displayString = '<article class="feed-item">' + fromField + messageField + pictureField + linkField + descriptionField + captionField + '</article>';

      document.getElementById('display').innerHTML += displayString;
    }
  }

})();
