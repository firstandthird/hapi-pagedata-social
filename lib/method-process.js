'use strict';

module.exports = function(url, done) {
  const server = this.server;
  this.cache.get(url, (err, data) => {
    if (err) {
      server.log(['pagedata-social', 'debug', 'urlinfo'], { url, err });
      return done(null, null);
    }

    return done(null, data);
  });
};
