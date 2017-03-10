const pkg = require('./package.json');
const Hoek = require('hoek');

const defaults = {
  parserOptions: {
    twitter: {
      key: '',
      secret: ''
    },
    facebook: {
      token: ''
    },
    instagram: {
      token: ''
    },
    youtube: {
      key: ''
    },
    vimeo: {},
    basic: {}
  }
};

exports.register = function(server, options, next) {
  if (!options) {
    options = {};
  }
  
  const config = Hoek.applyToDefaults(defaults, options);
  
  const internal = {
    server,
    config
  };

  server.method('pageData.getSocial', require('./lib/method-get').bind(internal));
  server.method('pageData.processSocial', require('./lib/method-process').bind(internal));
  
  next();
};

exports.register.attributes = {
  once: true,
  pkg
};
