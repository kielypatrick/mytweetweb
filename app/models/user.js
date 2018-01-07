'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Piper'
  }],

  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rat'
  }],

  profilePic: {
      data: Buffer,
      contentType: String,
      }
});

const User = mongoose.model('User', userSchema);
module.exports = User;