'use strict';
const UrlInfo = require('urlinfo');

module.exports = function(url, done) {
  const urlInfo = new UrlInfo(this.config.parserOptions);
  
  console.log(url);
  
  urlInfo.parse(url, (err, data) => {
    console.log(err, data);
    done(err, data);
  });
};
