'use strict';

const User = require('../models/user');
const Boom = require('boom');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const utils = require('./utils.js');


exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
     const user = new User(request.payload);
    User.findOne({ email: user.email }).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
        if (isValid) {
          const token = utils.createToken(foundUser);
        reply({ success: true, token: token, user: foundUser,  message: 'Authentication successful. User: '
        + user.email}).code(201);
        } else {
          reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
        }
      }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  });
 },

};

exports.find = {

  auth: false,

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findOne = {

  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.create = {

  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;

    bcrypt.hash(plaintextPassword, saltRounds, function(err, hash) {
      user.password = hash;
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  })},

};

exports.deleteAll = {

  auth: false,

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },

};

exports.deleteOne = {

  auth: false,

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(User).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.followUser = {

  auth: false,

  handler: function (request, reply) {

    let loggedInUser = request.params.id;
    const memberId = request.payload;
    User.findOne({email: loggedInUser}).then(currentUser => {
      User.findOne({_id: memberId}).then(foundUser => {
        currentUser.following.push(foundUser._id);
        foundUser.followers.push(currentUser._id);
        currentUser.save();
        foundUser.save();
        console.log(loggedInUser + " is now following " + memberId);

        reply(User).code(204);
      }).catch(err => {
        reply(Boom.notFound('id not found'));
      });
    });
  },
}