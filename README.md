**This project is very far from production-ready. Use at your own risk.**

Permit A38
====

Permit A38 is a linting tool which leverages [JSONPath](https://goessner.net/articles/JsonPath/) to create declarative rules executed over a TypeScript abstract syntax tree.

## Usage

Currently it's only possible to use this project as a library with a single interesting method in the API, namely:

```typescript
checkRuleForSource(source: string, rule: Rule): boolean
```

which accepts the following parameters:
 - `source` - the source code that is being checked.
 - `rule` a rule object as defined in `src/types.ts` with fields:
   - `select` - JSONPath which queries for nodes that will be selected for checking.
   - `filter` - JSONPath filtering the selected nodes.
   - `matchType` - `'all'` or `'none'` indicating that for the check to pass all or none of the nodes respectively have to match the filtering query.

### Example
```javascript
const noReadonly = `
  class TestClass {
    field1: string;
    readonly field2: string;
  }
`;

const result = checkRuleForSource(noReadonly, {
    select: '$..[?(PropertyDeclaration)]',
    filter: '$..modifiers[?(ReadonlyKeyword)]',
    matchType: 'none',
    type: 'single-select-filter'
});
```

Check out [https://astexplorer.net](https://astexplorer.net) to see the AST JSON over which the queries are executed.

The rule above selects nodes having `PropertyDeclaration` as their [SyntaxKind](https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts). The resulting array is then queried for nodes which have a `modifier` with the SyntaxKind `ReadonlyKeyword`. `matchType: 'none'` indicates that in order for the rule to pass no node must meet this criterion.

See the tests for more examples.

## Aliases and extensions

### SyntaxKind

SyntaxKind keys are aliased with `@.kind===0000`, where `0000` is the respective enum value. The `?` prefix drops the `@` from the beginning of this substitution.

#### Examples:

 - `PropertySignature` is an alias for `@.kind===161`
 - `@.expression?ParenthesizedExpression` turns into `@.expression.kind===204`

### Previous

Each node that is part of an array in the AST(object properties, class members, function paremeters etc.) is decorated with a `__previous` property pointing to a copy of the previous node, but with its own `__previous` field not present so as to avoid deep routes.

### Comments

Comments are not normally part of the AST, but this library decorates the nodes appropriately. The fields are named the same as in [https://astexplorer.net](https://astexplorer.net), but the nodes to which the comments are attached may be different.