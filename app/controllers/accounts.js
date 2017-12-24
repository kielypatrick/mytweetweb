'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');
const Joi = require('joi');


exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },

};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for MyTweet' });
  },

};

exports.register = {
  auth: false,
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

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });
  },

};

exports.authenticate = {

  auth: false,

  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign in error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({email: user.email}).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
        if (isValid) {
          request.cookieAuth.set(
              {
                loggedIn: true,
                loggedInUser: user.email,

              });
          if (user.email === 'marge@simpson.com') {
            console.log("logging in admin " + user.email)
            reply.redirect('/admin');
          }
          else {
            reply.redirect('/home');
          }
        }
        else
        {
          console.log("logging probs " + user.email)

          reply.redirect('/signup');
        }

      })
    }).
    catch(err => {
      console.log("logging problem" + user.email)

      reply.redirect('/signup');
    })
  }
};


exports.settings = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};


exports.settingsUpdate = {

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      var userEmail = request.auth.credentials.loggedInUser;

      User.findOne({ email: userEmail }).then(foundUser => {
        reply.view('settings', {
          title: 'ya what?',
          errors: error.data.details,
          user: foundUser
        }).code(400);
      });
    },
    options: {
      abortEarly: false,
    },


  },

  handler: function (request, reply) {
    const editedUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },

};