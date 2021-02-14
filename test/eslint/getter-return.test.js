const {checkRuleForSource} = require('../../lib');
const test = require('ava');

const getterReturn = {
  select: [
    `$..[?(
      CallExpression &&
      @.expression?PropertyAccessExpression &&
      @.expression.name.escapedText=="defineProperty"
    )]
    .arguments[2]
    `,
    `$..[?(ObjectLiteralExpression)]
      .properties[?(
        PropertyAssignment &&
        @.name.escapedText=="get"
      )]
      .initializer.body.statements
    `
  ],
  filter: [`$[?(ReturnStatement)]`],
  matchType: 'all',
  type: 'multi-select-filter'
};

test('getter-return bad', t => {
  const source = `  
    p = {
      get name(){
          // no returns.
      }
    };

    Object.defineProperty(p, "age", {
      get: function (){
          // no returns.
      }
    });

    class P{
      get name(){
          // no returns.
      }
    }
  `;

  const result = checkRuleForSource(source, getterReturn);

  t.is(result, false);
});

test('getter-return good', t => {
  const source = `  
    p = {
      get name(){
          // no returns.
      }
    };

    Object.defineProperty(p, "age", {
      get: function (){
          console.log(x);
          return 1;
      }
    });

    class P{
      get name(){
          // no returns.
      }
    }
  `;

  const result = checkRuleForSource(source, getterReturn);

  t.is(result, true);
});