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

    if (pd.parentKey) {
      if (!data[pd.parentKey]) {
        return done(`Configuration Error. Parent key ${pd.parentKey} is not found on the page`);
      }
      data = data[pd.parentKey];
    }

    async.reduce(data, [],  (memo, url, next) => {
      server.methods.pageData.processSocial(url, (processErr, dataObj) => {
        if (processErr) {
          return next(processErr);
        }
        if (dataObj !== null) {
          memo.push(dataObj);
        }

        next(null, memo);
      });
    }, (mapErr, results) => {
      if (mapErr) {
        return done(mapErr);
      }
      done(null, results);
    });
  });
};
