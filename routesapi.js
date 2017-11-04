const TweetsApi = require('./app/api/tweetsapi');

module.exports = [
  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },

];