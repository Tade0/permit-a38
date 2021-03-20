const {checkRuleForSource} = require('../lib');
const test = require('ava');

test('Arrow function returning arrow function', (t) => {
  const source = `
    const arrowArrow = () => () => {}
  `;

  t.is(checkRuleForSource(source, {
    select: '$..[?(ArrowFunction)].body',
    filter: '$..[?(ArrowFunction)]',
    matchType: 'none'
  }), false);
});
