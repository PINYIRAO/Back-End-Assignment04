import { Router } from "express";
import * as branchController from "../controllers/branchController";
import { validateRequest } from "../middleware/validate";
import { branchSchema } from "../validations/branchValidation";
import { Request, Response, NextFunction } from "express";

// define a router for deal with
const router: Router = Router();

/**
 * @route GET /
 * @description Get all branches.
 */
/**
 * @openapi
 * /api/v1/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     responses:
 *         200:
 *           description: All branches
 *         500:
 *           description: Server error
 */
router.get("/", branchController.getAllBranches);

/**
 * @route GET /:id
 * @description Get an existing branch.
 */
/**
 * @openapi
 * /api/v1/branches/{id}:
 *   get:
 *     summary: Get an existing branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the branch to be found
 *     responses:
 *       200:
 *         description: The wanted branch
 *       404:
 *         description: No branch found with the specified id
 *       500:
 *         description: Server error
 */
router.get("/:id", branchController.getBranchById);

/**
 * @route POST /
 * @description Create a new branch
 */
/**
 * @openapi
 * /api/v1/branches:
 *  post:
 *   summary: Create a new branch
 *   tags: [Branch]
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phone:
 *               type: string
 *   responses:
 *     201:
 *       description: the new branch
 *     500:
 *       description: Server error
 */
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    validateRequest(branchSchema("POST"))(req, res, next),
  branchController.createBranch
);

/**
 * @route PUT /:id
 * @description Update an existing branch.
 *
 * @openapi
 * /api/v1/branches/{id}:
 *   put:
 *     summary: Update an existing branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the branch to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                   type: string
 *     responses:
 *       200:
 *         description: The updated branch
 *       404:
 *         description: No branch found with the specified id
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    validateRequest(branchSchema("PUT"))(req, res, next),
  branchController.updateBranch
);

/**
 * @route DELETE /:id
 * @description Delete a branch profile.
 */
/**
 * @openapi
 * /api/v1/branches/{id}:
 *   delete:
 *     summary: Delete an existing branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the branch to be deleted
 *     responses:
 *      200:
 *         description: Delete successfully
 *      404:
 *        description: No branch found with the specified id
 *      500:
 *        description: Server error
 */
router.delete("/:id", branchController.deleteBranch);

export default router;
