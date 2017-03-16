declare module Predicate {

  type PredicateExpression = PredicateLogicalExpression | PredicateTypeExpression | PredicatePresentExpression;
  enum PredicateExpressions {
    PredicateLogicalExpression = 1,
    PredicateTypeExpression = 2,
    PredicatePresentExpression = 3
  }
  export interface PredicatePresentExpression {
    expression: string;
    arguments: string[];
  }
  export interface PredicateLogicalExpression {
    expression: string;
    arguments: PredicateExpression[];
  }
  export interface PredicateTypeExpression {
    left_get: string;
    left_arg: string;
    operator: string;
    right: (string | number);
  }
}
