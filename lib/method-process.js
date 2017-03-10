'use strict';

module.exports = function(url, done) {
  this.cache.get(url, done);
};
