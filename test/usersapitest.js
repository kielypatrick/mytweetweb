'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweetservice');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const myTweetService = new MyTweetService(fixtures.myTweetService);

  beforeEach(function () {
    myTweetService.deleteAllUsers();
  });

  afterEach(function () {
    myTweetService.deleteAllUsers();
  });

  test('create a user', function () {
    const returnedUser = myTweetService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const u1 = myTweetService.createUser(newUser);
    const u2 = myTweetService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const u1 = myTweetService.getUser('1234');
    assert.isNull(u1);
    const u2 = myTweetService.getUser('012345678901234567890123');
    assert.isNull(u2);
  });

  test('delete a user', function () {
    const u = myTweetService.createUser(newUser);
    assert(myTweetService.getUser(u._id) != null);
    myTweetService.deleteOneUser(u._id);
    assert(myTweetService.getUser(u._id) == null);
  });

  test('get all users', function () {
    for (let u of users) {
      myTweetService.createUser(u);
    }

    const allUsers = myTweetService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test('get users detail', function () {
    for (let u of users) {
      myTweetService.createUser(u);
    }

    const allUsers = myTweetService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });

  test('get all users empty', function () {
    const allUsers = myTweetService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});