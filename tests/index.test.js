'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const redPerfumeHtml = require('../index.js');
const validator = require('@/validator.js')

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

        expect(redPerfumeHtml.atomize())
          .toEqual(undefined);

        expect(console.error)
          .toHaveBeenCalledWith(testHelpers.trimIndentation(`
            _________________________
            Red-Perfume:
            options.tasks Must be an array of objects. See documentation for details.
          `, 12));

        console.error = consoleError;
        consoleError = undefined;
      });
    });

    describe('Valid options with tasks', () => {
      test('Using data and afterOutput hook', () => {
        options = {
          ...options,
          input: '<!DOCTYPE html><html><body><div class="example"></div></body></html>',
          classMap: {
            '.example': ['.rp__0', '.rp__1']
          }
        };

        expect(redPerfumeHtml.atomize(options))
          .toEqual({
            atomizedHtml: '<!DOCTYPE html><html><head></head><body><div class="rp__0 rp__1"></div></body></html>'),
            markupErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });

      describe('Every type of CSS', () => {
        const input = testHelpers.trimIndentation(`
          <!DOCTYPE html>
          <html>
            <body>
              <div class="simple pseudo"></div>
              <div class="after">
                <div class="nested"></div>
              </div>
            </body>
          </html>
        `, 10);

        describe('Simple', () => {
          test('Normal', () => {
            options = {
              ...options,
              input,
              classMap: {
                '.simple': [
                  '.rp__padding__--COLON10px',
                  '.rp__margin__--COLON10px'
                ]
              }
            }
            const { atomizedHtml, markupErrors } = redPerfumeHtml.atomize(options);

            expect(testHelpers.trimIndentation(atomizedHtml))
              .toEqual(testHelpers.trimIndentation(`
                <!DOCTYPE html><html><head></head><body>
                  <div class="pseudo rp__padding__--COLON10px rp__margin__--COLON10px"></div>
                  <div class="after">
                    <div class="nested"></div>
                  </div>
                </body></html>
              `, 16));

            expect(markupErrors)
              .toEqual([]);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });

          test('Uglify', () => {
            options = {
              ...options,
              input,
              classMap: {
                '.simple': [
                  '.rp__0',
                  '.rp__1'
                ]
              }
            };

            const { atomizedHtml, markupErrors } = redPerfumeHtml.atomize(options);

            expect(testHelpers.trimIndentation(atomizedHtml))
              .toEqual(testHelpers.trimIndentation(`
                <!DOCTYPE html><html><head></head><body>
                  <div class="pseudo rp__0 rp__1"></div>
                  <div class="after">
                    <div class="nested"></div>
                  </div>
                </body></html>
              `, 16));

            expect(markupErrors)
              .toEqual([]);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });
        });

        describe('Pseudo', () => {
          test('Normal', () => {
            options = {
              ...options,
              input,
              classMap: {
                '.pseudo': [
                  '.rp__color__--COLON__--OCTOTHORPF00',
                  '.rp__text-decoration__--COLONnone',
                  '.rp__color__--COLON__--OCTOTHORPA00___-HOVER',
                  '.rp__text-decoration__--COLONunderline___-HOVER'
                ]
              }
            };

            const { atomizedHtml, markupErrors } = redPerfumeHtml.atomize(options);

            expect(testHelpers.trimIndentation(atomizedHtml))
              .toEqual(testHelpers.trimIndentation(`
                <!DOCTYPE html><html><head></head><body>
                  <div class="simple rp__color__--COLON__--OCTOTHORPF00 rp__text-decoration__--COLONnone rp__color__--COLON__--OCTOTHORPA00___-HOVER rp__text-decoration__--COLONunderline___-HOVER"></div>
                  <div class="after">
                    <div class="nested"></div>
                  </div>
                </body></html>
              `, 30));

            expect(markupErrors)
              .toEqual([]);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });

          test('Uglify', () => {
            options = {
              ...options,
              input,
              classMap: {
                '.pseudo': [
                  '.rp__0',
                  '.rp__1',
                  '.rp__2',
                  '.rp__3'
                ]
              }
            };

            const { atomizedHtml, markupErrors } = redPerfumeHtml.atomize(options);

            expect(testHelpers.trimIndentation(atomizedHtml))
              .toEqual(testHelpers.trimIndentation(`
                <!DOCTYPE html><html><head></head><body>
                  <div class="simple rp__0 rp__1 rp__2 rp__3"></div>
                  <div class="after">
                    <div class="nested"></div>
                  </div>
                </body></html>
              `, 30));

            expect(markupErrors)
              .toEqual([]);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
