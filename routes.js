const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Admin = require('./app/controllers/admin');


module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/settings', config: Accounts.settings },
  { method: 'POST', path: '/settingsupdate', config: Accounts.settingsUpdate },
  { method: 'GET',    path: '/getProfilePic/{authorId}', config: Accounts.getProfilePic1 },


  //{ method: 'GET', path: '/piperlist', config: Accounts.piperList },



  { method: 'GET', path: '/admin', config: Admin.admin },
  { method: 'GET', path: '/viewusers', config: Admin.viewusers },
  { method: 'POST', path: '/adminregister', config: Admin.register },
  { method: 'GET', path: '/users/{userId}/deleteUser', config: Admin.deleteUser },


  { method: 'GET', path: '/home', config: Tweets.newsfeed },
  { method: 'GET', path: '/newsfeed', config: Tweets.newsfeed },
  { method: 'GET', path: '/mine', config: Tweets.mine },

  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET',    path: '/getTweetImg/{_id}', config: Tweets.getTweetImg },

  { method: 'GET', path: '/membertimeline/{authorId}', config: Tweets.membertimeline },
  { method: 'GET', path: '/tweets/{tweetId}/deleteTweet', config: Tweets.deleteTweet },

  // {
  //   method: 'GET', path: '/tweets/{tweetId}/deleteTweet',
  //   handler: function (request, reply) {
  //     reply('Click ' + '!  Go <a href="/login">here</a> to delete tweet ' + request.params.tweetId);
  //   }
  // },


  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];