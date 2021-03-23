import {match} from '../match';
import {sanitize} from '../sanitize';
import {SingleSelectFilter, MatchType} from '../types';

export function checkSingleSelectFilterRule(node: Object, rule: SingleSelectFilter) {
  const selected = match(node, sanitize(rule.select));

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
