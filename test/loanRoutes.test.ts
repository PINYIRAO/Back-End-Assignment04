import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import { Loan } from "../src/api/v1/models/loanModel";
import { MiddlewareFunction } from "src/api/v1/types/expressTypes";
import {
  getAllLoans,
  getLoanById,
  createLoan,
  reviewLoan,
  approveLoan,
} from "../src/api/v1/controllers/loanController";

jest.mock("../src/api/v1/controllers/loanController", () => ({
  getAllLoans: jest.fn((req, res) => res.status(200).send()),
  getLoanById: jest.fn((req, res) => res.status(200).send()),
  createLoan: jest.fn((req, res) => res.status(201).send()),
  reviewLoan: jest.fn((req, res) => res.status(200).send()),
  approveLoan: jest.fn((req, res) => res.status(200).send()),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
  return jest.fn((req: Request, res: Response, next: NextFunction) => next());
});

jest.mock("../src/api/v1/middleware/authorize", (): MiddlewareFunction => {
  return jest.fn(
    (options) => (req: Request, res: Response, next: NextFunction) => next()
  );
});

describe("Loan Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/loans", () => {
    it("should call getAllLoans controller", async () => {
      await request(app).get("/api/v1/loans");
      expect(getAllLoans).toHaveBeenCalled();
    });
  });

  describe("POST /api/v1/loans", () => {
    it("should call createLoan controller", async () => {
      const mockLoan: Partial<Loan> = {
        amount: 50000000,
        term: 60,
        client: "the last person in poverty",
      };

      await request(app).post("/api/v1/loans").send(mockLoan);
      expect(createLoan).toHaveBeenCalled();
    });
  });

  describe("PUT /api/v1/loans/:id/review", () => {
    it("should call review loan controller", async () => {
      const mockLoan: Partial<Loan> = {
        amount: 50000000,
        term: 60,
      };

      const mockId: string = "100";

      await request(app).put(`/api/v1/loans/${mockId}/review`).send(mockLoan);
      expect(reviewLoan).toHaveBeenCalled();
    });
  });

  describe("PUT /api/v1/loans/:id/approve", () => {
    it("should call approve loan controller", async () => {
      const mockLoan: Partial<Loan> = {
        status: "Approved",
      };

      const mockId: string = "100";

      await request(app).put(`/api/v1/loans/${mockId}/approve`).send(mockLoan);
      expect(approveLoan).toHaveBeenCalled();
    });
  });
});
