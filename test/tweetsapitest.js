'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweetservice');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
var request = require('sync-request');



suite('Tweet API tests', function () {

  let tweets = fixtures.tweets;
  let newTweet = fixtures.newTweet;

  const myTweetService = new MyTweetService('http://localhost:4000');

  beforeEach(function () {
    myTweetService.deleteAllTweets();
  });

  afterEach(function () {
    myTweetService.deleteAllTweets();
  });

  test('create a tweet', function () {
    const returnedTweet = myTweetService.createTweet(newTweet);
    assert(_.some([returnedTweet], newTweet));
    assert.isDefined(returnedTweet._id);
  });



  //
  // test('create multiple donations', function () {
  //   const returnedCandidate = myTweetService.createCandidate(newCandidate);
  //   for (var i = 0; i < donations.length; i++) {
  //     myTweetService.makeDonation(returnedCandidate._id, donations[i]);
  //   }
  //
  //   const returnedDonations = myTweetService.getDonations(returnedCandidate._id);
  //   assert.equal(returnedDonations.length, donations.length);
  //   for (var i = 0; i < donations.length; i++) {
  //     assert(_.some([returnedDonations[i]], donations[i]), 'returned donation must be a superset of donation');
  //   }
  // });
  //
  // test('delete all donations', function () {
  //   const returnedCandidate = myTweetService.createCandidate(newCandidate);
  //   for (var i = 0; i < donations.length; i++) {
  //     myTweetService.makeDonation(returnedCandidate._id, donations[i]);
  //   }
  //
  //   const d1 = myTweetService.getDonations(returnedCandidate._id);
  //   assert.equal(d1.length, donations.length);
  //   myTweetService.deleteAllDonations();
  //   const d2 = myTweetService.getDonations(returnedCandidate._id);
  //   assert.equal(d2.length, 0);
  // });
});