'use strict';
const async = require('async');

module.exports = function(key, done) {
  const server = this.server;
  if (typeof key === 'function') {
    done = key;
    key = this.config.pagedata.parentKey;
  }
  const slug = this.config.pagedata.slug;

  const start = new Date().getTime();
  server.methods.pagedata.getPageContent(slug, (err, data) => {
    if (err) {
      return done(err);
    }

    if (!data) {
      return done(null, []);
    }

    if (key) {
      if (!data[key]) {
        const msg = `Configuration Error. Parent key ${key} is not found on the page`;
        server.log(['pagedata-social', 'error'], msg);
        return done(new Error(msg));
      }
      data = data[key];
    }

    async.map(data, (url, next) => {
      server.methods.pagedata.processSocial(url, (processErr, dataObj) => {
        if (processErr) {
          //continue if error - we log in processSocial method
          return next();
        }
        next(null, dataObj);
      });
    }, (mapErr, results) => {
      if (mapErr) {
        return done(mapErr);
      }
      const posts = results.filter((item) => (item));
      done(null, posts);
    });
  });
};
