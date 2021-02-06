const {checkRuleForSource} = require('../../lib');
const test = require('ava');

const getterReturn = {
  select: [
    `$..[?(
      @.kind==#CallExpression# &&
      @.expression.kind==#PropertyAccessExpression# &&
      @.expression.name.escapedText=="defineProperty"
    )]
    .arguments[2]
    `,
    `$..[?(@.kind==#ObjectLiteralExpression#)]
      .properties[?(
        @.kind==#PropertyAssignment# &&
        @.name.escapedText=="get"
      )]
      .initializer.body.statements
    `
  ],
  filter: [`$..[?(
    @.kind==#ReturnStatement#
  )]`],
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