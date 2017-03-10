'use strict';

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
  },
  cache: {
    segment: 'pagedata-social',
    enabled: (process.env.NODE_ENV === 'production'),
    expiresIn: 1000 * 60 * 60 * 24 * 7, //1 week
    staleIn: 1000 * 60 * 60 * 23, //23 hours
    staleTimeout: 200,
    generateTimeout: 5000
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

  config.cache.generateFunc = require('./lib/urlInfo').bind(internal);
  if (!config.cache.enabled) {
    delete config.cache.staleIn;
    delete config.cache.staleTimeout;
    config.cache.expiresIn = 1;
  }
  delete config.cache.enabled;
  internal.cache = server.cache(config.cache);

  server.method('pageData.getSocial', require('./lib/method-get').bind(internal));
  server.method('pageData.processSocial', require('./lib/method-process').bind(internal));

  next();
};

exports.register.attributes = {
  once: true,
  pkg,
  dependencies: 'hapi-pagedata'
};
