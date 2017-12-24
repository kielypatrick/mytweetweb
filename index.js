'use strict';

const Hapi = require('hapi');

var server = new Hapi.Server();
// const fs = require('fs');
// var options = {
//   port: 4443,     //  or any port you wish
//   tls: {
//     key: fs.readFileSync('private/webserver.key'),
//     cert: fs.readFileSync('private/webserverSelf.crt')
//   }
// };
// server.connection(options);

server.connection({ port: process.env.PORT || 4000 });

server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  require('./app/models/db');

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'mytweet-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
  });

  server.auth.default({
    strategy: 'standard',
  });

server.route(require('./routes'));
server.route(require('./routesapi'));


server.start((err) => {
  if (err) {
    throw err;
  }

  console.log('Server listening at:', server.info.uri);
});

});