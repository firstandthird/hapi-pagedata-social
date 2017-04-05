/* eslint-disable no-console */
'use strict';

const Hapi = require('hapi');
const port = process.env.PORT || 8080;

const server = new Hapi.Server({
  debug: {
    log: ['pagedata', 'error', 'cache', 'pagedata-social'],
    request: ['error']
  }
});
server.connection({ port });

server.register({
  register: require('hapi-pagedata'),
  options: {
    host: 'http://localhost:8080',
    key: 'target',
    verbose: true
  }
});

server.register({
  register: require('../'),
  options: {
    pagedata: {
      slug: 'some-page',
      parentKey: 'socialData'
    },
    parserOptions: {
      instagram: {
        token: ''
      },
      twitter: {
        key: '',
        secret: ''
      }
    }
  }
}, (err) => {
  if (err) {
    throw err;
  }

  //mock pagedata
  server.route({
    path: '/api/pages/{page}',
    method: 'GET',
    handler(request, reply) {
      reply({
        content: {
          socialData: [
            'https://www.instagram.com/p/BDVkDO0oKOz/',
            'https://www.instagram.com/p/BDVi2IHqHxy/',
            'https://www.instagram.com/p/BSeUOedjs5c/' 
          ]
        }
      });
    }
  });

  server.route({
    path: '/',
    method: 'GET',
    handler(request, reply) {
      const serv = request.server;
      serv.methods.pagedata.getSocial((routeErr, data) => {
        if (routeErr) {
          return reply(routeErr);
        }
        reply(data);
      });
    }
  });

  server.start((serverErr) => {
    if (serverErr) {
      throw serverErr;
    }
    console.log('Server started', server.info.uri);
  });
});
