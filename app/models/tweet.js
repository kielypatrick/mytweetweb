

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  body: String,
  length: Number,
  date: {
    type: String,
    ref: new Date().getDate(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;