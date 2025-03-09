/**
 * Loan Controller (loanController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to loans.
 * These functions interact with the high-risk loan service (loanService.ts) to perform the actual
 * logic for CRUD operations on loans.
 */

import { Request, Response, NextFunction } from "express";
import * as loanService from "../services/loanService";
import type { Loan } from "../models/loanModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Get all loans.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllLoans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loans: Loan[] = await loanService.getAllLoans();

    res.status(HTTP_STATUS.OK).json(successResponse(loans));
  } catch (error) {
    next(error);
  }
};

/**
 * @description get an existing loan by id.
 * @route get /:id
 * @returns {Promise<void>}
 */
export const getLoanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the loanService by passing the id from thge url path and the body of the request
    const loan: Loan = await loanService.getLoanById(req.params.id);

    res.status(HTTP_STATUS.OK).json(successResponse(loan, "Loan Found"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Create a new loan.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the loanService by passing the body of the request
    const newLoan: Loan = await loanService.createLoan(req.body);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newLoan, "Loan Created"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description review an existing loan.
 * @route PUT /:id/review
 * @returns {Promise<void>}
 */
export const reviewLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // protect status field
    const newLoan: Partial<Loan> = { ...req.body };
    delete newLoan.client;
    delete newLoan.requestDate;
    // set default value for new loan status
    newLoan.status = "In Review Process";

    // call the loanService by passing the id from thge url path and the body of the request
    const updatedLoan: Loan = await loanService.updateLoan(
      req.params.id,
      newLoan
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedLoan, "Loan has been reviewed"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description approve an existing loan.
 * @route PUT /:id/approve
 * @returns {Promise<void>}
 */
export const approveLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // protect status field
    const newLoan: Partial<Loan> = { ...req.body };
    delete newLoan.client;
    delete newLoan.requestDate;
    delete newLoan.amount;
    delete newLoan.term;
    // set to approved temporarily
    newLoan.status = "Approved";

    // call the loanService by passing the id from thge url path and the body of the request
    const updatedLoan: Loan = await loanService.updateLoan(
      req.params.id,
      newLoan
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(updatedLoan, "The decision on the loan has been made")
      );
  } catch (error) {
    next(error);
  }
};
