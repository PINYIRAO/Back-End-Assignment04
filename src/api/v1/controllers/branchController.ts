/**
 * Branches Controller (branchController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to branches.
 * These functions interact with the branch service (branchService.ts) to perform the actual
 * logic for CRUD operations on branches.
 */

import { Request, Response, NextFunction } from "express";
import * as branchService from "../services/branchService";
import type { Branch } from "../models/branchModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Get all branches.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const branches: Branch[] = await branchService.getAllBranches();

    res.status(HTTP_STATUS.OK).json(successResponse(branches));
  } catch (error) {
    next(error);
  }
};

/**
 * @description get an existing branch by id.
 * @route get /:id
 * @returns {Promise<void>}
 */
export const getBranchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the branchService by passing the id from thge url path and the body of the request
    const branch: Branch = await branchService.getBranchById(req.params.id);

    res.status(HTTP_STATUS.OK).json(successResponse(branch, "Branch Found"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Create a new branch.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the branchService by passing the body of the request
    const newBranch: Branch = await branchService.createBranch(req.body);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newBranch, "Branch Created"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update an existing branch.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the branchService by passing the id from thge url path and the body of the request
    const updatedBranch: Branch = await branchService.updateBranch(
      req.params.id,
      req.body
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedBranch, "Branches Updated"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete an branch.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deleteBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await branchService.deleteBranch(req.params.id);

    res.status(HTTP_STATUS.OK).json(successResponse("Branch Deleted"));
  } catch (error) {
    next(error);
  }
};
