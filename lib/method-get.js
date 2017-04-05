'use strict';
const async = require('async');
const Hoek = require('hoek');

module.exports = function(opts, done) {
  const server = this.server;
  const pd = this.config.pagedata;

  if (typeof opts === 'function') {
    done = opts;
    opts = {};
  }

  const args = Hoek.applyToDefaults(pd, opts);

  server.methods.pagedata.getPageContent(args.slug, args.tag, (err, data) => {
    if (err) {
      return done(err);
    }

    if (!data) {
      return done(null, []);
    }

    if (args.parentKey) {
      if (!data[args.parentKey]) {
        return done(`Configuration Error. Parent key ${args.parentKey} is not found on the page`);
      }
      data = data[args.parentKey];
    }

    async.reduce(data, [],  (memo, url, next) => {
      server.methods.pageData.processSocial(url, (processErr, dataObj) => {
        if (processErr) {
          return next(processErr);
        }

        if (dataObj.error) {
          // Passing the error back in the dataObj so as to cache the results
          return next(null, memo);
        }

        if (dataObj !== null) {
          dataObj.pageUrl = url;
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
