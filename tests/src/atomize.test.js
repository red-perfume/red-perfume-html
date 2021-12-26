'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const atomize = require('@/atomize.js');
const validator = require('@/validator.js');

describe('HTML', () => {
  let options;
  const ERROR_RESPONSE = Object.freeze({
    atomizedHtml: '<html><head></head><body></body></html>',
    markupErrors: Object.freeze([
      'Error parsing HTML'
    ])
  });

  beforeEach(() => {
    options = {
      verbose: true,
      customLogger: jest.fn()
    };
  });

  describe('Bad inputs', () => {
    test('Default options', () => {
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual(ERROR_RESPONSE);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Error parsing HTML', ERROR_RESPONSE.atomizedHtml);
    });

    test('Empty input string', () => {
      options.input = '';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual(ERROR_RESPONSE);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Error parsing HTML', ERROR_RESPONSE.atomizedHtml);
    });
  });

  describe('Process HTML', () => {
    test('Half comment', () => {
      options.input = '><!--';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: '<html><head></head><body>&gt;<!----></body></html>',
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('One rule', () => {
      options.input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test">Good</h1></body></html>';
      options.classMap = {
        '.test': [
          '.rp__background__--COLON__--OCTOTHORPF00'
        ]
      };
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__background__--COLON__--OCTOTHORPF00">Good</h1></body></html>',
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('One rule uglified', () => {
      options.classMap = {
        '.test': [
          '.rp__0'
        ]
      };
      options.input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test">Good</h1></body></html>';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__0">Good</h1></body></html>',
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Two rules, two properties', () => {
      options.classMap = {
        '.test': [
          '.rp__background__--COLON__--OCTOTHORPF00',
          '.rp__width__--COLON100px'
        ],
        '.example': [
          '.rp__color__--COLON__--blue',
          '.rp__padding__--COLON__--20px'
        ]
      };
      options.input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test example">Good</h1></body></html>';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '</head>',
            '<body>',
            '<h1 class="rp__background__--COLON__--OCTOTHORPF00 rp__width__--COLON100px rp__color__--COLON__--blue rp__padding__--COLON__--20px">',
            'Good',
            '</h1>',
            '</body>',
            '</html>'
          ].join(''),
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Two rules, two properties uglified', () => {
      options.classMap = {
        '.test': [
          '.rp__0',
          '.rp__1'
        ],
        '.example': [
          '.rp__2',
          '.rp__3'
        ]
      };
      options.input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test example">Good</h1></body></html>';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__0 rp__1 rp__2 rp__3">Good</h1></body></html>',
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('No matching classes in map', () => {
      options.classMap = {
        '.test': [
          '.rp__background__--COLON__--OCTOTHORPF00'
        ]
      };
      options.input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="example">Good</h1></body></html>';
      options = validator.validateOptions(options);

      expect(atomize(options))
        .toEqual({
          atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="example">Good</h1></body></html>',
          markupErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });
});
