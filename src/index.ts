const jsonpath = require('jsonpath');
const flatMap = require('lodash/flatMap');
const last = require('lodash/last');
import {
  createSourceFile,
  ScriptTarget,
  SyntaxKind,
  getLeadingCommentRanges,
  getTrailingCommentRanges,
  forEachChild,
  SourceFile,
  Node,
  CommentRange,
} from 'typescript';

import { MatchType, MultiSelectFilter, Rule, RuleType, SingleSelectFilter } from './types';

const query = jsonpath.query.bind(jsonpath);

export function matchSource(source: string, pathQueries: string[]) {
  return matchBatch(createSourceFile('file.ts', source, ScriptTarget.Latest), pathQueries);
}

export function matchBatch(sourceFile: Object, pathQueries: string[]) {
  return pathQueries.reduce((acc, pathQuery) => {
    if (acc) {
      return flatMap(acc, item => match(item, pathQuery));
    }

    return acc;
  }, [sourceFile]);
}

export function match(node: Object, pathQuery: string): Object[] {
  const pathQueryWithKinds = pathQuery.replace(/(#.*?#)/g, keyword => {
    if (SyntaxKind[keyword.slice(1, -1)]) {
      return SyntaxKind[keyword.slice(1, -1)];
    }

    return keyword;
  })

  return query(node, pathQueryWithKinds);
}

export function checkRuleForSource(source: string, rule: Rule) {
  const sourceFile = createSourceFile('file.ts', source, ScriptTarget.Latest);

  decorateWithComments(sourceFile);
  decorateWithPrevious(sourceFile);

  switch (rule.type) {
    case RuleType.SingleSelectFilter:
      return checkSingleSelectFilterRule(sourceFile, rule);
    case RuleType.MultiSelectFilter:
      return checkMultiSelectFilterRule(sourceFile, rule);
    default:
      return false;
  }
}

export function decorateWithComments(sourceFile: SourceFile, currentNode?: Node) {
  const decorateWithCommentText = (comment: CommentRange) => (comment as any).text = sourceFile.getFullText().slice(comment.pos, comment.end);

  forEachChild(currentNode || sourceFile, (node: Node) => {
    const leadingCommentRanges = getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart()) || [];
    const trailingCommentRanges = getTrailingCommentRanges(sourceFile.getFullText(), node.getEnd()) || [];

    leadingCommentRanges.forEach(decorateWithCommentText);
    trailingCommentRanges.forEach(decorateWithCommentText);

    (node as any).leadingComments = leadingCommentRanges;
    (node as any).trailingComments = trailingCommentRanges;

    forEachChild(node, (childNode: Node) => decorateWithComments(sourceFile, childNode));
  });
}

export function decorateWithPrevious(sourceFile: SourceFile) {
  const previousStack: Node[] = [undefined];

  const doTheDecoration = (node: Node & { previous?: any }) => {
    const previousNode = last(previousStack);

    if (previousNode) {
      const { previous, ...restProps } = previousNode;

      node.previous = restProps;
    }

    previousStack.push(undefined);

    forEachChild(node, doTheDecoration);

    previousStack.pop();
    previousStack[previousStack.length - 1] = node;
  };

  doTheDecoration(sourceFile);
}

export function checkSingleSelectFilterRule(node: Object, rule: SingleSelectFilter) {
  const selected = match(node, sanitize(rule.select));

  console.debug(`matching selection "${rule.select}": ${selected.length}`);

  return selected.reduce((acc, item) => {
    if (!acc) {
      return acc;
    }

    const hasMatch = match([item], sanitize(rule.filter)).length > 0;

    switch (rule.matchType) {
      case MatchType.NONE:
        return acc && !hasMatch;
      case MatchType.ALL:
        return acc && hasMatch;
    }
  }, true);
}

export function checkMultiSelectFilterRule(node: Object, rule: MultiSelectFilter) {
  const [firstSelect, ...restSelect] = rule.select.map(pathQuery => sanitize(pathQuery));
  const [firstFilter, ...restFilter] = rule.filter.map(pathQuery => sanitize(pathQuery));

  const selected = restSelect
    .reduce((acc, pathQuery) => {
      return match(acc, pathQuery);
    }, match(node, firstSelect));

  return selected.reduce((acc, item) => {

    const hasMatch = restFilter
    .reduce((acc, pathQuery) => {
      return match(acc, pathQuery);
    }, match(item, firstFilter)).length > 0;

    switch (rule.matchType) {
      case MatchType.NONE:
        return acc && !hasMatch;
      case MatchType.ALL:
        return acc && hasMatch;
    }
  }, true);
}

function sanitize(pathQuery: string) {
  return pathQuery.replace(/[\n\r]+\s*/g, '');
}
