'use strict';
const async = require('async');

module.exports = function(site, slug, tag, done) {
  const server = this.server;
  if (!done) {
    done = tag;
    tag = null;
  }
  server.methods.pageData.get(site, slug, tag, (err, data) => {
    if (err) {
      return done(err);
    }

    if (!data) {
      return done(null, []);
    }
    

    async.mapSeries(data, (url, next) => {
      server.methods.pageData.processSocial(url, next);
    }, (err, results) => {
      if (err) {
        return done(err);
      }

      done(null, results);
    });
  });
};
