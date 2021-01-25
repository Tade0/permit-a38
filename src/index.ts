import {query} from 'jsonpath';
import {createSourceFile, ScriptTarget, SyntaxKind, getLeadingCommentRanges, getTrailingCommentRanges, forEachChild, SourceFile, Node, CommentRange} from 'typescript';
import flatMap from 'lodash/flatMap';
import { MatchType, Rule } from './types';


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

  return checkRule(sourceFile, rule);
}

export function decorateWithComments(sourceFile: SourceFile, currentNode?: Node) {
  const decorateWithCommentText = (comment: CommentRange) => (comment as any).text = sourceFile.getFullText().slice(comment.pos, comment.end);

  forEachChild(currentNode || sourceFile, node => {
    const leadingCommentRanges = getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart()) || [];
    const trailingCommentRanges = getTrailingCommentRanges(sourceFile.getFullText(), node.getEnd()) || [];

    leadingCommentRanges.forEach(decorateWithCommentText);
    trailingCommentRanges.forEach(decorateWithCommentText);

    (node as any).leadingComments = leadingCommentRanges;
    (node as any).trailingComments = trailingCommentRanges;

    forEachChild(node, childNode => decorateWithComments(sourceFile, childNode));
  });
}

export function checkRule(node: Object, rule: Rule) {
  const selected = match(node, rule.select);

  console.debug(`matching selection "${rule.select}": ${selected.length}`);

  return selected.reduce((acc, item) => {
    if (!acc) {
      return acc;
    }

    const hasMatch = match([item], rule.filter).length > 0;

    switch (rule.matchType) {
      case MatchType.NONE:
        return acc && !hasMatch;
      case MatchType.ALL:
        return acc && hasMatch;
    }
  }, true);
}
