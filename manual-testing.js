'use strict';

/**
 * @file    A place to play around with/try to out Red Perfume
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('red-perfume-css');
const redPerfumeHtml = require('./index.js');

const input = `
  .cow,
  .cat {
      font-size: 12px;
      padding: 8px;
  }
  .dog {
      font-size: 12px;
      background: #F00;
      padding: 8px;
  }
`;
const normal = redPerfumeCss({ uglify: false, input }).classMap;
const uglified = redPerfumeCss({ uglify: true, input }).classMap;
const inputMarkup = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <p class="cool cow moo">
        Hi there!
      </p>
      <!--
        <span class="dog">comments are skipped</span>
      -->
      <h1 class="cool cat nice wow">
        Meow
      </h1>
      <h2 class="dog hover">
        Woof
      </h2>
    </body>
  </html>
`;

const normalHtml = redPerfumeHtml({
  classMap: normal,
  input: inputMarkup
});

const uglifiedHtml = redPerfumeHtml({
  classMap: uglified,
  input: inputMarkup
});

console.log({ inputMarkup, normalHtml, uglifiedHtml });
