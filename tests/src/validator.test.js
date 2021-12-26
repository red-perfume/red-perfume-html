'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const validator = require('@/validator.js');

const testHelpers = require('@@/testHelpers.js');

describe('Validator', () => {
  let options;

  beforeEach(() => {
    options = {
      verbose: true,
      customLogger: jest.fn()
    };
  });

  describe('validateBoolean', () => {
    test('undefined, true', () => {
      expect(validator.validateBoolean(undefined, true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('undefined, false', () => {
      expect(validator.validateBoolean(undefined, false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('falsy, true', () => {
      expect(validator.validateBoolean('', true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('truthy, false', () => {
      expect(validator.validateBoolean('asdf', false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('true, true', () => {
      expect(validator.validateBoolean(true, true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('false, false', () => {
      expect(validator.validateBoolean(false, false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('true, false', () => {
      expect(validator.validateBoolean(true, false))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('false, true', () => {
      expect(validator.validateBoolean(false, true))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateObject', () => {
    test('Falsy', () => {
      expect(validator.validateObject(options, false, 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Non-object', () => {
      expect(validator.validateObject(options, 'key', 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .toHaveBeenCalledWith('message', undefined);
    });

    test('Object', () => {
      const obj = {};

      expect(validator.validateObject(options, obj, 'message'))
        .toEqual(obj);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateString', () => {
    test('Falsy', () => {
      expect(validator.validateString(options, false, 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Non-string', () => {
      expect(validator.validateString(options, {}, 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .toHaveBeenCalledWith('message', undefined);
    });

    test('String', () => {
      expect(validator.validateString(options, 'Test', 'message'))
        .toEqual('Test');

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateCustomLogger', () => {
    let consoleError;

    beforeEach(() => {
      consoleError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = consoleError;
      consoleError = undefined;
    });

    test('Falsy', () => {
      options.customLogger = false;

      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(false);

      expect(console.error)
        .not.toHaveBeenCalled();
    });

    test('Non-function', () => {
      options.customLogger = {};

      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(false);

      expect(console.error)
        .toHaveBeenCalledWith(testHelpers.trimIndentation(`
          _________________________
          Red-Perfume:
          Optional customLogger must be a type of function.
        `, 10));
    });

    test('Function', () => {
      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(true);

      expect(console.error)
        .not.toHaveBeenCalled();

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateOptions', () => {
    describe('Bad inputs', () => {
      let consoleError;

      const DEFAULT_OUTPUT = Object.freeze({
        verbose: true
      });

      beforeEach(() => {
        consoleError = console.error;
        console.error = jest.fn();
      });

      afterEach(() => {
        console.error = consoleError;
        consoleError = undefined;
      });

      test('Undefined', () => {
        expect(validator.validateOptions())
          .toEqual(DEFAULT_OUTPUT);

        expect(console.error)
          .not.toHaveBeenCalled();
      });

      test('Array', () => {
        expect(validator.validateOptions([]))
          .toEqual(DEFAULT_OUTPUT);

        expect(console.error)
          .not.toHaveBeenCalled();
      });

      test('Empty object', () => {
        expect(validator.validateOptions({}))
          .toEqual(DEFAULT_OUTPUT);

        expect(console.error)
          .not.toHaveBeenCalled();
      });
    });
  });
});
