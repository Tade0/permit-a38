const last = require('lodash/last');
import {
  forEachChild,
  SourceFile,
  Node
} from 'typescript';

export function decorateWithPrevious(sourceFile: SourceFile) {
  const previousStack: Node[] = [undefined];

  const doTheDecoration = (node: Node & { __previous?: any }) => {
    const previousNode = last(previousStack);

    if (previousNode) {
      const { previous, ...restProps } = previousNode;

      node.__previous = restProps;
    }

    previousStack.push(undefined);

    forEachChild(node, doTheDecoration);

    previousStack.pop();
    previousStack[previousStack.length - 1] = node;
  };

  doTheDecoration(sourceFile);
}
