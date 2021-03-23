import {
  createSourceFile,
  ScriptTarget
} from 'typescript';

import { Rule, RuleType } from './types';
import {checkSingleSelectFilterRule} from './rule-types/single-select-filter';
import {checkMultiSelectFilterRule} from './rule-types/multi-select-filter';
import {decorateWithComments} from './decorators/comments';
import {decorateWithPrevious} from './decorators/previous';

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
