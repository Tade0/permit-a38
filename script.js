const {checkRuleForSource} = require('./build');

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

console.log(checkRuleForSource(commentOverLabel, {
  select: "$..[?(@.kind==#PropertyAssignment#  && @.name.escapedText=='label')].name",
  filter: "$..leadingComments[?(@.text.startsWith('// gettext'))]",
  matchType: 'all'
}));

const noReadonly = `
class TestClass {
  field1: string;
  readonly field2: string;
}
`;

console.log(!checkRuleForSource(noReadonly, {
  select: '$..[?(@.kind==#PropertyDeclaration#)]',
  filter: '$..modifiers[?(@.kind==#ReadonlyKeyword#)]',
  matchType: 'none'
}));

const noPrivate = `
class TestClass {
  field1: string;
  field2: string;

  private method() {}
}
`;

console.log(!checkRuleForSource(noPrivate, {
  select: '$..[?(@.kind==#ClassDeclaration#)].members',
  filter: '$..modifiers[?(@.kind==#PrivateKeyword#)]',
  matchType: 'none'
}));
