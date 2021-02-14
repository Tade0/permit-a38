const {checkRuleForSource} = require('../../lib');
const test = require('ava');

const noAsyncPromiseExecutor = {
  select: '$..[?(NewExpression && @.expression.escapedText==="Promise")]',
  filter: '$[*].arguments[0].modifiers[?(AsyncKeyword)]',
  matchType: 'none',
  type: 'single-select-filter'
};

test('no-async-promise-executor bad', t => {
  const source = `
  const foo = new Promise(async (resolve, reject) => {
    readFile('foo.txt', function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  const result = new Promise(async (resolve, reject) => {
    resolve(await foo);
  });
  `;

  t.is(checkRuleForSource(source, noAsyncPromiseExecutor), false);
});

test('no-async-promise-executor good', t => {
  const source = `
  const foo = new Promise((resolve, reject) => {
    readFile('foo.txt', function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  const result = Promise.resolve(foo);
  `;

  t.is(checkRuleForSource(source, noAsyncPromiseExecutor), true);
});
