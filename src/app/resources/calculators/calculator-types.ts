export type EnergyCosts = {
  [key: string]: number;
};

export type LoanTerms = {
  [key: number]: boolean;
};

export type LoanResult = {
  payment: number;
  netCost: number;
};

export type LoanResults = {
  [key: number]: LoanResult;
};

export type CalculationResults = {
  oldMonthlyCost: number;
  newMonthlyCost: number;
  annualSavings: number;
  monthlySavings: number;
  roiText: string;
  loanResults: LoanResults;
};
