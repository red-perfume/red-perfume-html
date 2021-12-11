'use strict';

/**
 * @file    The core functionality of the library.
 * @author  TheJaredWilcurt
 */

const validator = require('./src/validator.js');
const atomize = require('./src/atomize.js');

/**
 * Validates inputs and atomizes Markup.
 *
 * @param  {object} options  User's options
 * @return {object}          Results of atomization
 */
const redPerfumeHtml = function (options) {
  options = validator(options);
  return atomize(options);
};

module.exports = redPerfumeHtml;
