const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');


module.exports = [
  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'POST', path: '/api/tweets', config: TweetsApi.createTweet},
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAllTweets},
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteTweet},



  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },


];