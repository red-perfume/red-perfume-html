'use strict';

/**
 * @file    Validate and default the options object per documented API and log warnings.
 * @author  TheJaredWilcurt
 */

const helpers = require('./helpers.js');

const validator = {
  /**
   * Validates and defaults would-be booleans.
   *
   * @param  {boolean} key    Value to validate
   * @param  {boolean} value  Default value to use if not a boolean
   * @return {boolean}        The value or default
   */
  validateBoolean: function (key, value) {
    if (typeof(key) !== 'boolean') {
      key = value;
    }
    return key;
  },
  /**
   * Validates a value is an object.
   *
   * @param  {object} options  User's options
   * @param  {object} key      The value that should be a object
   * @param  {string} message  The message to log if not an object
   * @return {object}          The object or undefined
   */
  validateObject: function (options, key, message) {
    if (
      key &&
      (
        typeof(key) !== 'object' ||
        Array.isArray(key)
      )
    ) {
      key = undefined;
      helpers.throwError(options, message);
    }
    if (!key) {
      key = undefined;
    }
    return key || {};
  },
  /**
   * Validates a value is a string.
   *
   * @param  {object} options  User's options
   * @param  {string} key      Value that should be a string
   * @param  {string} message  The message to log if not a string
   * @return {string}          The string or undefined
   */
  validateString: function (options, key, message) {
    if (key === '' || (key && typeof(key) !== 'string')) {
      key = undefined;
      helpers.throwError(options, message);
    }
    if (!key) {
      key = undefined;
    }
    return key || '';
  },

  /**
   * Validates optional customLogger is a function.
   *
   * @param  {object} options  User's options
   * @return {object}          Modified user's options
   */
  validateCustomLogger: function (options) {
    if (!options.customLogger) {
      delete options.customLogger;
    } else if (typeof(options.customLogger) !== 'function') {
      delete options.customLogger;
      helpers.throwError(options, 'Optional customLogger must be a type of function.');
    }
    return options;
  },

  /**
   * Validates and defaults all values in the options object,
   * including tasks.
   *
   * @param  {object} options  User's options
   * @return {object}          Modified user's options
   */
  validateOptions: function (options) {
    if (typeof(options) !== 'object' || Array.isArray(options)) {
      options = undefined;
    }
    options = options || {};
    options.verbose = this.validateBoolean(options.verbose, true);
    options = this.validateCustomLogger(options);
    options.classMap = this.validateObject(options, options.classMap, 'The classMap must be an object.');
    options.input = this.validateString(options, options.input, 'The input markup must be a string.');
    return options;
  }
};

module.exports = validator;
