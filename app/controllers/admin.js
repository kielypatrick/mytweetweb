'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');



exports.admin = {

  handler: function (request, reply) {

    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {

      Tweet.find({}).populate('author').populate('user').then(allTweets => {

        // let timeline = [];
        // allTweets.forEach(tweet => {
        //   timeline.push(tweet)
        // });
        reply.view('admin', {
          title: 'Newsfeed',
          tweets: allTweets,
          user: foundUser
        });
        console.log("Show timeline for " + userEmail)
      }).catch(err => {
        reply.redirect('/');
      });
    })
  },
};

exports.viewusers = {

  handler: function (request, reply) {

    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {

      User.find({}).populate('_id').then(allUsers => {

        // let timeline = [];
        // allTweets.forEach(tweet => {
        //   timeline.push(tweet)
        // });
        reply.view('users', {
          title: 'Users',
          users: allUsers,
        });
        console.log("Show users for " + userEmail)
      }).catch(err => {
        console.log(err)

        reply.redirect('/');
      });
    })
  },
};


exports.register = {
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
    options: {
      abortEarly: false,
    },

  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    const plaintextPassword = user.password;

    bcrypt.hash(plaintextPassword, saltRounds, function(err, hash) {
      user.password = hash;
      return user.save().then(newUser => {
        reply.redirect('/login');
      }).catch(err => {
        reply.redirect('/');
      });
    })}

};

exports.deleteUser = {
  handler: function (request, reply) {

    const user = request.params.userId;
    console.log(user);
    User.findByIdAndRemove(user, function (err) {
        if (err) throw err;
        console.log('Deleting user: ' + user);
            });

    Tweet.remove({ author: user }).then(result =>{
    reply.redirect('/viewusers');
     });
    // console.log('Deleting tweet: ' + user);
    //
    //
    //
    //
    //
    // reply.redirect('/viewusers');

 },
};


