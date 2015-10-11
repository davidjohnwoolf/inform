var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var FeedSchema = new Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Feed', FeedSchema);
