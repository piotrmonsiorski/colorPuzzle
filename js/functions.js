Array.prototype.toHEX = function () {
  // convert every value of array to HEX, then concat to accumulator starting with #
  // make sure concater string has at least 2 chars <- padStart
  return this.reduce( (acc, val) => acc.concat( val.toString(16).padStart(2, '0') ), '#');
};
