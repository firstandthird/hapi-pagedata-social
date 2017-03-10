'use strict';
const UrlInfo = require('urlinfo');

module.exports = function(url, done) {
  const urlInfo = new UrlInfo(this.config.parserOptions);

  urlInfo.parse(url, done);
};
