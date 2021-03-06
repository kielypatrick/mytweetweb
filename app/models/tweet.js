

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  body: String,
 // length: Number,
  date: {
    type: Number,
    ref: new Date().getTime(),

  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  img: {
    data: Buffer,
    contentType: String,
  }

});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;