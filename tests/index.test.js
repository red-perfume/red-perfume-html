'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const redPerfumeHtml = require('../index.js');
const validator = require('@/validator.js');

const testHelpers = require('@@/testHelpers.js');

describe('Red Perfume', () => {
  let options;

  beforeEach(() => {
    options = validator.validateOptions({
      verbose: true,
      customLogger: jest.fn()
    });
  });

  describe('Atomize', () => {
    describe('Failures and invalid states', () => {
      test('Empty', () => {
        let consoleError = console.error;
        console.error = jest.fn();
        const atomizedHtml = '<html><head></head><body></body></html>';

        expect(redPerfumeHtml())
          .toEqual({
            atomizedHtml,
            markupErrors: [
              'Error parsing HTML'
            ]
          });

        expect(console.error)
          .toHaveBeenCalledWith(
            testHelpers.trimIndentation(`
              _________________________
              Red-Perfume:
              Error parsing HTML
            `, 14),
            atomizedHtml
          );

        console.error = consoleError;
        consoleError = undefined;
      });
    });

    // More detailed CSS tests go in the other test files
    describe('One simple integration test', () => {
      const input = '<!DOCTYPE html><html><body><div class="simple"></div></body></html>';
      const cssInput = `
        .simple {
          padding: 10px;
          margin: 10px;
        }
      `;

      describe('Simple', () => {
        test('Normal', () => {
          options = {
            ...options,
            input,
            classMap: testHelpers.produceClassMap(cssInput, options.customLogger)
          };

          expect(redPerfumeHtml(options))
            .toEqual({
              atomizedHtml: [
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '</head>',
                '<body>',
                '<div class="rp__padding__--COLON10px rp__margin__--COLON10px">',
                '</div>',
                '</body>',
                '</html>'
              ].join(''),
              markupErrors: []
            });

          expect(options.customLogger)
            .not.toHaveBeenCalled();
        });

        test('Uglify', () => {
          options = {
            ...options,
            input,
            classMap: testHelpers.produceClassMap(cssInput, options.customLogger, true)
          };

          expect(redPerfumeHtml(options))
            .toEqual({
              atomizedHtml: [
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '</head>',
                '<body>',
                '<div class="rp__0 rp__1">',
                '</div>',
                '</body>',
                '</html>'
              ].join(''),
              markupErrors: []
            });

          expect(options.customLogger)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
