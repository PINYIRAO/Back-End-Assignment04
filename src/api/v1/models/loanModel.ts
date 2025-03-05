export interface Loan {
  id: string;
  caseId: string;
  interest: number;
  amount: number;
  Term: number;
  client: string;
  status: "Request" | "In Review Process" | "Approved" | "Rejected";
  requestDate: Date;
  effectiveDate: Date;
}
