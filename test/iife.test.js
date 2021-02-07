const {checkRuleForSource} = require('../lib');
const test = require('ava');

const enforceIIFEcall = {
  select: `$..[?(
    @.expression &&
    @.expression.kind===#ParenthesizedExpression# &&
    (@.expression.expression.kind===#FunctionExpression# || @.expression.expression.kind===#ArrowFunction#)
  )]`,
  filter: '$[?(@.kind===#CallExpression#)]',
  matchType: 'all',
  type: 'single-select-filter'
};

test('Call IIFE bad', t => {
  const source = `
  const x = {
    a: 1,
    b: 'test',
    ...(() => {}),
    ...(function () {}),
  };
  `;

  t.is(checkRuleForSource(source, enforceIIFEcall), false);
});

test('Call IIFE good', t => {
  const source = `
  const x = {
    a: 1,
    b: 'test',
    ...(() => {})(),
    ...(function () {})(),
  };
  `;

  t.is(checkRuleForSource(source, enforceIIFEcall), true);
});

test('Call IIFE previous node problem', t => {
  const source = `
  const x = {
    a: 1,
    b: 'test',
    ...(() => {})(),
    ...(function () {})(),
    ...(function () {}),
  };
  `;

  t.is(checkRuleForSource(source, enforceIIFEcall), false);
});
