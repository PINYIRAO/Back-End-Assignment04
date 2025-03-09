import { Router } from "express";
import * as loanController from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// define a router for deal with
const router: Router = Router();

/**
 * @route GET /
 * @description Get all loans.
 */
/**
 * @openapi
 * /api/v1/loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loan]
 *     responses:
 *         200:
 *           description: All loans
 *         401:
 *           description: Unauthorized user
 *         403:
 *           description: Insufficient privileges
 *         500:
 *           description: Server error
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager"] }),
  loanController.getAllLoans
);

/**
 * @route GET /:id
 * @description Get an existing loan.
 */
/**
 * @openapi
 * /api/v1/loans/{id}:
 *   get:
 *     summary: Get an existing loan
 *     tags: [Loan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the loan to be found
 *     responses:
 *       200:
 *         description: The wanted loan
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Insufficient privileges
 *       404:
 *         description: No loan found with the specified id
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager"] }),
  loanController.getLoanById
);

/**
 * @route POST /
 * @description Create a new loan
 */
/**
 * @openapi
 * /api/v1/loans:
 *  post:
 *   summary: Create a new loan
 *   tags: [Loan]
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             term:
 *               type: number
 *             client:
 *               type: string
 *   responses:
 *    201:
 *     description: the new loan
 *    401:
 *     description: Unauthorized user
 *    403:
 *     description: Insufficient privileges
 *    500:
 *     description: Server error
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user"] }),
  loanController.createLoan
);

/**
 * @route PUT /:id/review
 * @description Update an existing loan.
 *
 * @openapi
 * /api/v1/loans/{id}/review:
 *   put:
 *     summary: Update an existing loan
 *     tags: [Loan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the loan to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               term:
 *                 type: number
 *     responses:
 *       200:
 *         description: The the loan has been updated.
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Insufficient privileges
 *       404:
 *         description: No loan found with the specified id
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/review",
  authenticate,
  isAuthorized({ hasRole: ["officer"] }),
  loanController.reviewLoan
);

/**
 * @route PUT /:id/approve
 * @description approve an existing loan.
 *
 * @openapi
 * /api/v1/loans/{id}/approve:
 *   put:
 *     summary: Approve an existing loan
 *     tags: [Loan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the loan to approve
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: string
 *     responses:
 *       200:
 *         description: The decision on the loan has been made.
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Insufficient privileges
 *       404:
 *         description: No loan found with the specified id
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/approve",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  loanController.approveLoan
);

export default router;
