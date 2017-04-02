'use strict';

const pkg = require('./package.json');
const Hoek = require('hoek');

const defaults = {
  pagedata: {
    slug: '',
    parentKey: 'socialPosts'
  },
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
  enableCache: true,
  verbose: true,
  cache: {
    expiresIn: 1000 * 60 * 60 * 24 * 7, //1 week
    staleIn: 1000 * 60 * 60 * 23, //23 hours
    staleTimeout: 200,
    generateTimeout: 5000
  }
};

exports.register = function(server, options, next) {
  const config = Hoek.applyToDefaults(defaults, options, true);

  const internal = {
    server,
    config
  };

  server.method('pagedata.getSocial', require('./lib/method-get').bind(internal));

  server.method('pagedata.processSocial', require('./lib/method-process').bind(internal), {
    cache: config.enableCache ? Object.assign({}, config.cache) : undefined,
    generateKey(url) {
      return url;
    }
  });

  next();
};

exports.register.attributes = {
  once: true,
  pkg,
  dependencies: 'hapi-pagedata'
};
