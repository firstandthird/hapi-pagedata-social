/* eslint-disable no-console */
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
    host: '',
    key: ''
    verbose: true,
    site: 'some-site',
    cache: {
      enabled: false
    }
  }
});

server.register({
  register: require('../'),
  options: {} 
}, (err) => {
  if (err) {
    throw err;
  }

  server.route({
    path: '/',
    method: 'GET',
    handler(request, reply) {
      const server = request.server;
      server.methods.pageData.getSocial('another-site', 'social-posts', (err, data) => {
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
