export interface Loan {
  id: string;
  amount: number;
  term: number;
  client: string;
  status: "Request" | "In Review Process" | "Approved" | "Rejected";
  requestDate: Date;
}
