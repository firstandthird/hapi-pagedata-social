'use strict';
const UrlInfo = require('urlinfo');

module.exports = function(url, done) {
  const config = this.config;
  const server = this.server;
  const urlInfo = new UrlInfo(this.config.parserOptions);

  const start = new Date().getTime();
  urlInfo.parse(url, (err, data) => {
    if (err) {
      server.log(['pagedata-social', 'error', url], err);
      return done(err);
    }
    data.pageUrl = url;
    const end = new Date().getTime();

    if (config.verbose) {
      server.log(['pagedata-social', 'info'], {
        message: 'url fetched',
        url,
        duration: (end - start) / 1000
      });
    }
    done(null, data);
  });
};
