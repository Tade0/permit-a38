const {checkRuleForSource} = require('../lib');
const test = require('ava');

test('Sort good', t => {
  const sort = `
  export interface Interface {
    a: string;
    b: string;
    c: string;
    d: string;
  }`;

  t.is(checkRuleForSource(sort, {
    select: `$..members[?(
      @.kind===#PropertySignature# &&
      @.previous &&
      @.previous.kind===#PropertySignature#
    )]`,
    filter: '$[?(@.name.escapedText > @.previous.name.escapedText)]',
    matchType: 'all',
    type: 'single-select-filter'
  }), true);
});

test('Sort bad', t => {
  const sorte = `
  export interface Interface {
    a: string;
    d: string;
    c: string;
    d: string;
  }`;

  t.is(checkRuleForSource(sorte, {
    select: `$..members[?(
      @.kind===#PropertySignature# &&
      @.previous &&
      @.previous.kind===#PropertySignature#
    )]`,
    filter: '$[?(@.name.escapedText > @.previous.name.escapedText)]',
    matchType: 'all',
    type: 'single-select-filter'
  }), false);
});