const {checkRuleForSource} = require('../lib');
const test = require('ava');

const noLiteralTypeClassMember = {
  select: '$..[?(ClassDeclaration)].members[?(PropertyDeclaration)].type',
  filter: '$..[?(LiteralType)]',
  matchType: 'none',
  type: 'single-select-filter'
};

test('Dissalow class field type as literal all kinds', t => {
  const source = `
  class SomeClass {
    field1: 'string-literal';
    field2: 1;
  }
  `;

  t.is(checkRuleForSource(source, noLiteralTypeClassMember), false);
});

test('Allow class field type as non-literal', t => {
  const source = `
  class SomeClass {
    field1: string;
    field2: number;
  }
  `;

  t.is(checkRuleForSource(source, noLiteralTypeClassMember), true);
});

test('Detect literal type in mixed casees', t => {
  const source = `
  class SomeClass {
    field1: string;
    field2: number;
    field3: 'string-literal';
    field4: 1;
  }
  `;

  t.is(checkRuleForSource(source, noLiteralTypeClassMember), false);
});

test('Don\'t confuse literal type with literal assignment', t => {
  const source = `
  class SomeClass {
    field1 = 'string-literal';
    field2 = 1;
  }
  `;

  t.is(checkRuleForSource(source, noLiteralTypeClassMember), true);
});
