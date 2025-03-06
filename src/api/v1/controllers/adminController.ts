import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { AuthenticationError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

export const setCustomClaims = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { uid, claims } = req.body;

  try {
    await auth.setCustomUserClaims(uid, claims);
    res
      .status(HTTP_STATUS.OK)
      .send(successResponse({}, `Custom claims set for user: ${uid}`));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(
        new AuthenticationError(
          `SetCustomClaims Unseccessfully: ${getErrorMessage(error)}`,
          getErrorCode(error)
        )
      );
    } else {
      next(error);
    }
  }
};
