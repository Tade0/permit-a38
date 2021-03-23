const jsonpath = require('jsonpath');
import {SyntaxKind} from 'typescript';

const query = jsonpath.query.bind(jsonpath);

export function match(node: Object, pathQuery: string): Object[] {
  const pathQueryWithKinds = pathQuery
    .replace(/\??[A-Z]\w+/g, token => {
      const keyword = token.replace(/^\?/, '');

      if (SyntaxKind[keyword]) {
        if (token.startsWith('?')) {
          return `.kind===${SyntaxKind[keyword]}`;
        } else {
          return `@.kind===${SyntaxKind[keyword]}`;
        }
      }

      return keyword;
    })

  return query(node, pathQueryWithKinds);
}

