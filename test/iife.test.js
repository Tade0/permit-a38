const {checkRuleForSource} = require('../lib');
const test = require('ava');

const enforceIIFEcall = {
  select: `$..[?(
    @.expression &&
    @.expression?ParenthesizedExpression &&
    (@.expression.expression?FunctionExpression || @.expression.expression?ArrowFunction)
  )]`,
  filter: '$[?(CallExpression)]',
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
