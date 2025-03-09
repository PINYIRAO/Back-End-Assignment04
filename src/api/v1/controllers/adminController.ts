import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import {
  AuthenticationError,
  ExtendedError,
  ServiceError,
} from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";
import fetch, { Response as FetchResponse } from "node-fetch";
import { DecodedIdToken } from "firebase-admin/auth";

// the users data in the request body
interface User {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

interface TokenObjects {
  uid: string;
  email: string;
  idToken: string;
  role: "admin" | "officer" | "manager" | "user";
}

interface TokenResponse {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

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

export const getTokenAndRoleBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const users: User[] = req.body;

  const url: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA_tCJcoArqjtLG6oBi81s37P26Mu05-DU";

  if (!users) {
    return next(
      new ExtendedError(
        "Should contain the users information in body",
        "NO USER PROVIDED",
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  try {
    const tokenObjects: TokenObjects[] = [];
    for (const value of users) {
      const response: FetchResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        return next(
          new ServiceError(
            `Failed to get the user ${value.email}'s Token`,
            "FAILED_GET_TOKEN",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
          )
        );
      }
      const result: TokenResponse = (await response.json()) as TokenResponse;

      const decodedIdToken: DecodedIdToken = await auth.verifyIdToken(
        result.idToken
      );

      tokenObjects.push({
        uid: decodedIdToken.uid,
        email: result.email,
        idToken: result.idToken,
        role: decodedIdToken.role,
      });
    }
    res
      .status(HTTP_STATUS.OK)
      .send(
        successResponse(
          tokenObjects,
          `Tokens and Roles for users are fetched successfully.`
        )
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(
        new ServiceError(
          `Get IdTokens and roles Unseccessfully: ${getErrorMessage(error)}`,
          getErrorCode(error)
        )
      );
    } else {
      next(error);
    }
  }
};
