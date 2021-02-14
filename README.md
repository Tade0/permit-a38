## Aliases and extensions

### SyntaxKind

[SyntaxKind](https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts) keys are aliased with `@.kind===0000`, where `0000` is the respective enum value. The `?` prefix drops the `@` from the beginning of this substitution.

#### Examples:

 - `PropertySignature` is an alias for `@.kind===161`
 - `@.expression?ParenthesizedExpression` turns into `@.expression.kind===204`

Check the tests for examples.

### Previous

Each node which that is part of an array in the AST(object properties, class members, function paremeters etc.) is decorated with a `__previous` property pointing to a copy of the previous node, but with its own `__previous` field not present so as to avoid deep routes.
