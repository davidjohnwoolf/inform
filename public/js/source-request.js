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
      var date = new Date(data.data[i].created_time)

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

      var fromField = '<h5>' + data.data[i].from.name + ' - ' + time + '</h5>';

      var messageField = '<h4>' + (data.data[i].message || data.data[i].story) + '</h4>';
      var pictureField = '';
      if (data.data[i].picture) {
        pictureField = '<div class="picture"><img src=' + data.data[i].full_picture + ' alt=' + data.data[i].description + '>';
      }
      var descriptionField = '';
      if (data.data[i].description) {
        descriptionField = '<p>' + data.data[i].description + '</p>';
      }
      var captionField = '';
      if (data.data[i].caption) {
        captionField = '<small>' + data.data[i].caption + '</small>';
      } else if (data.data[i].picture && !data.data[i].caption) {
        captionField = '</div>'
      }
      var linkField = '';
      if (data.data[i].link) {
        linkField = '<a href=' + data.data[i].link + ' target=_blank>' + (data.data[i].name || data.data[i].link) + '</a>';
      }

      var displayString = '<article class="feed-item">' + fromField + messageField + pictureField + linkField + descriptionField + captionField + '</article>';

      document.getElementById('display').innerHTML += displayString;
    }
  }

})();
