/* eslint-disable no-console */
'use strict';

const Hapi = require('hapi');
const port = process.env.PORT || 8080;

const server = new Hapi.Server({
  debug: {
    log: ['pagedata', 'error', 'cache'],
    request: ['error']
  }
});
server.connection({ port });

server.register({
  register: require('hapi-pagedata'),
  options: {
    host: 'http://localhost:8080',
    key: 'target',
    verbose: true,
    site: 'some-site',
    cache: {
      enabled: false
    }
  }
});

server.register({
  register: require('../'),
  options: {
    pagedata: {
      site: 'example',
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
    path: '/api/sites/{site}/pages/{page}',
    method: 'GET',
    handler(request, reply) {
      reply({
        content: {
          socialData: [
            'https://www.instagram.com/p/BDVkDO0oKOz/',
            'https://www.instagram.com/p/BDVi2IHqHxy/',
            'https://twitter.com/banks_jason/status/607291018447192064'
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
      serv.methods.pageData.getSocial((routeErr, data) => {
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
