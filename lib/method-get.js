'use strict';
const async = require('async');

module.exports = function(done) {
  const server = this.server;
  const pd = this.config.pagedata;
  
  server.methods.pageData.get(pd.site, pd.slug, pd.tag, (err, data) => {
    if (err) {
      return done(err);
    }

    if (!data) {
      return done(null, []);
    }

    async.mapSeries(data, (url, next) => {
      server.methods.pageData.processSocial(url, next);
    }, (mapErr, results) => {
      if (mapErr) {
        return done(mapErr);
      }
      done(null, results);
    });
  });
};
