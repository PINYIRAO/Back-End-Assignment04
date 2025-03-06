import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

describe("authenticate middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      locals: {},
    };
    nextFunction = jest.fn();
  });
  it("should call next passing authenticationError when no token is provided", async () => {
    // Assemble
    const expectedError: AuthenticationError = new AuthenticationError(
      "Unauthorized: No token provided",
      "TOKEN_NOT_FOUND"
    );

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expectedError);
  });
  it("should call next passing authenticationError when malformed token is provided", async () => {
    // Assemble
    mockRequest.headers = {
      authorization: "Bearer ",
    };

    const expectedError: AuthenticationError = new AuthenticationError(
      "Unauthorized: No token provided",
      "TOKEN_NOT_FOUND"
    );

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expectedError);
  });
});
