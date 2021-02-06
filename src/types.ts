export type Rule =
  | SingleSelectFilter
  | MultiSelectFilter;

export interface SingleSelectFilter {
  type: RuleType.SingleSelectFilter;
  select: string;
  filter: string;
  matchType: MatchType;
  errorMessage: string;
}

export interface MultiSelectFilter {
  type: RuleType.MultiSelectFilter;
  select: string[];
  filter: string[];
  matchType: MatchType;
  errorMessage: string;
}

export enum MatchType {
  ALL = 'all',
  NONE = 'none'
}

export enum RuleType {
  SingleSelectFilter = 'single-select-filter',
  MultiSelectFilter = 'multi-select-filter'
}
