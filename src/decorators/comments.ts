import {
  getLeadingCommentRanges,
  getTrailingCommentRanges,
  forEachChild,
  SourceFile,
  Node,
  CommentRange
} from 'typescript';

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
