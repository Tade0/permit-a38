export interface Rule {
  select: string;
  filter: string;
  matchType: MatchType;
  errorMessage: string;
}

export enum MatchType {
  ALL = 'all',
  NONE = 'none'
}