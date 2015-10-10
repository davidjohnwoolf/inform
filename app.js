var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.send('Welcome to Inform');
});

app.listen(3000);
