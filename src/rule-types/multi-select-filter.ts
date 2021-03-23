import {match} from '../match';
import {sanitize} from '../sanitize';
import {MultiSelectFilter, MatchType} from '../types';

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
