'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');




exports.newsfeed = {

  handler: function (request, reply) {

    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {

    Tweet.find({}).populate('author').populate('user').then(allTweets => {
      
      // let timeline = [];
      // allTweets.forEach(tweet => {
      //   timeline.push(tweet)
      // });
      reply.view('newsfeed', {
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

exports.tweet = {
  validate: {

    payload: {

      body: Joi.string().min(2).required(),
      date: Joi.string().required(),
      img: Joi.allow(null),

    },

    failAction: function (request, reply, source, error) {
      reply.view('newsfeed', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    const tweetImg = request.payload.img
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.author = user._id;
      if(tweetImg.length) { //look for image
        tweet.img.data = tweetImg;
       // tweet.img.contentType = 'image/png';
      }
      return tweet.save();
    }).then(newTweet => {
      if (userEmail === 'marge@simpson.com'){
        reply.redirect('/admin');
      }
      else {
        reply.redirect('/newsfeed');
      }
      console.log("Saving tweet from " + userEmail + newTweet)

    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },

};

exports.membertimeline = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    console.log(userEmail);
    let member = (request.params.authorId);
    console.log(member);
    if (userEmail === 'marge@simpson.com') {

      Tweet.find({author: member}).populate('author').then(allTweets => {
        reply.view('membertimeline', {
          title: 'Tweets',
          tweets: allTweets,
        });
        console.log("Show tweets by " + member)
      }).catch(err => {
        reply.redirect('/');
      });
    }
    //this if else sends admin to a slighty different view which has delete functions
    else {
      Tweet.find({author: member}).populate('author').then(allTweets => {
        reply.view('yours', {
          title: 'Tweets',
          tweets: allTweets,
        });
        console.log("Show tweets by " + member)
      }).catch(err => {
        reply.redirect('/');
      });
    }
  },
};

exports.deleteTweet = {
  handler: function (request, reply) {

    const tweet = request.params.tweetId;
    console.log(tweet);


    Tweet.findByIdAndRemove(tweet, function (err) {
        if (err) throw err;
        console.log('Deleting tweet: ' + tweet);
      });


    reply.redirect('/mine');

  },
};



exports.mine = {

  handler: function (request, reply) {

    var userEmail = request.auth.credentials.loggedInUser;

    if (userEmail === 'marge@simpson.com') {
      User.findOne({email: userEmail}).then(foundUser => {


        Tweet.find({author: foundUser.id}).populate('author').then(allTweets => {
          reply.view('adminmine', {
            title: 'Tweets',
            tweets: allTweets,
          });
          console.log("Show tweets by " + userEmail)
        }).catch(err => {
          reply.redirect('/');
        });
      })
    }
    else
      {
        User.findOne({email: userEmail}).then(foundUser => {

          Tweet.find({author: foundUser.id}).populate('author').then(allTweets => {

            reply.view('mine', {
              title: 'My Tweets',
              tweets: allTweets,
            });
            console.log("Show tweets by " + userEmail)
          }).catch(err => {
            reply.redirect('/');
          });
        })
      }
    }

};

exports.getTweetImg = {
  handler: function (req, res) {
    const tweetId = req.params._id;
    console.log("Show params " + tweetId)

    Tweet.findOne({_id: tweetId})
        .exec((err, foundTweet) => {
          if (foundTweet.img.data)
          {
            res(foundTweet.img.data).type('image');
            console.log("Show image with " + foundTweet.body)

          }
        });
  },
};