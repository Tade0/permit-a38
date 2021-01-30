const {checkRuleForSource} = require('./lib');
const test = require('ava');

test('Enforce "gettext" comment over label field', t => {
  const commentOverLabel = `
  /* comment */
  const routes: Routes = [
    {
      // gettext('heroes')
      path: 'heroes',
      test: 'eee',
      // gettext('heroes')
      label: 'label'
    }
  ];
  `;

  t.is(checkRuleForSource(commentOverLabel, {
    select: "$..[?(@.kind==#PropertyAssignment#  && @.name.escapedText=='label')].name",
    filter: "$..leadingComments[?(@.text.startsWith('// gettext'))]",
    matchType: 'all'
  }), true);
});

test('Dissalow readonly keyword', t => {
  const noReadonly = `
  class TestClass {
    field1: string;
    readonly field2: string;
  }
  `;

  t.is(checkRuleForSource(noReadonly, {
    select: '$..[?(@.kind==#PropertyDeclaration#)]',
    filter: '$..modifiers[?(@.kind==#ReadonlyKeyword#)]',
    matchType: 'none'
  }), false);
});

test('Dissalow private keyword', t => {
  const noPrivate = `
  class TestClass {
    field1: string;
    field2: string;

    private method() {}
  }
  `;

  t.is(checkRuleForSource(noPrivate, {
    select: '$..[?(@.kind==#ClassDeclaration#)].members',
    filter: '$..modifiers[?(@.kind==#PrivateKeyword#)]',
    matchType: 'none'
  }), false);
});
