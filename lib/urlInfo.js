'use strict';
const UrlInfo = require('urlinfo');

module.exports = function(url, done) {
  const urlInfo = new UrlInfo(this.config.parserOptions);
  urlInfo.parse(url, (err, data) => {
    if (err) {
      console.log(err);
      return done(null, { error: 1 });
    }

    done(null, data);
  });
};
