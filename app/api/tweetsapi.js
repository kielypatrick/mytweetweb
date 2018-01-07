'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');

exports.find = {

  auth: false,

  handler: function (request, reply) {
    Tweet.find({}).exec().then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};
exports.findOne = {

  auth: false,

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).then(tweet => {
      reply(tweet);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

}

exports.findUserTweets = {

  auth: false,

  handler: function (request, reply) {
    Tweet.find({ author: request.params.id }).exec().then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
}

exports.createTweet = {

  auth: false,

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
      console.log("Tweeting..");

    }).catch(err => {
      reply(Boom.badImplementation('error tweet'));
    });
  },

};

exports.deleteTweet = {

  auth: false,

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.deleteAllTweets = {

  auth: false,

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};