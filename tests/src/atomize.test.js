'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const atomize = require('@/atomize.js');
const validator = require('@/validator.js');
const testHelpers = require('@@/testHelpers.js');

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
    describe('Edge cases', () => {
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

      test('No matching classes in map', () => {
        options = validator.validateOptions({
          ...options,
          input: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="example">Good</h1></body></html>',
          classMap: testHelpers.produceClassMap('.test { background: #F00 }', options.customLogger)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="example">Good</h1></body></html>',
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });
    });

    describe('One rule', () => {
      const input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test">Good</h1></body></html>';
      const inputCss = '.test { background: #F00 }';

      test('Normal', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__background__--COLON__--OCTOTHORPF00">Good</h1></body></html>',
            atomizedHtml: [
              '<!DOCTYPE html>',
              '<html lang="en">',
              '<head>',
              '</head>',
              '<body>',
              '<h1 class="rp__background__--COLON__--OCTOTHORPF00">',
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

      test('Uglified', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger, true)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__0">Good</h1></body></html>',
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });
    });

    describe('Two rules, two properties', () => {
      const input = '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="test example">Good</h1></body></html>';
      const inputCss = `
        .test {
          background: #F00;
          width: 100px
        }
        .example {
          color: blue;
          padding: 20px;
        }
      `;

      test('Normal', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: [
              '<!DOCTYPE html>',
              '<html lang="en">',
              '<head>',
              '</head>',
              '<body>',
              '<h1 class="rp__background__--COLON__--OCTOTHORPF00 rp__width__--COLON100px rp__color__--COLONblue rp__padding__--COLON20px">',
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

      test('Uglified', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger, true)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: '<!DOCTYPE html><html lang="en"><head></head><body><h1 class="rp__0 rp__1 rp__2 rp__3">Good</h1></body></html>',
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });
    });

    describe('Nested selectors', () => {
      const input = [
        '<!DOCTYPE html><html lang="en"><head></head><body>',
        '<div class="test">',
        '<p class="nested"></p>',
        '</div>',
        '</body></html>'
      ].join('');
      const inputCss = `
        .test { background: #F00 }
        .test .nested { padding: 10px }
      `;

      test('Normal', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: [
              '<!DOCTYPE html><html lang="en"><head></head><body>',
              '<div class="rp__background__--COLON__--OCTOTHORPF00">',
              '<p class="rp__padding__--COLON10px"></p>',
              '</div>',
              '</body></html>'
            ].join(''),
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });

      test('Uglified', () => {
        options = validator.validateOptions({
          ...options,
          input,
          classMap: testHelpers.produceClassMap(inputCss, options.customLogger, true)
        });

        expect(atomize(options))
          .toEqual({
            atomizedHtml: [
              '<!DOCTYPE html><html lang="en"><head></head><body>',
              '<div class="rp__0">',
              '<p class="rp__1"></p>',
              '</div>',
              '</body></html>'
            ].join(''),
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });
    });
  });
});
