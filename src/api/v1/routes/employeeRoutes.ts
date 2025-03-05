import { Router } from "express";
import * as employeeController from "../controllers/employeeController";
import { validateRequest } from "../middleware/validate";
import { employeeSchema } from "../validations/employeeValidation";
import { Request, Response, NextFunction } from "express";

// define a router for deal with
const router: Router = Router();

/**
 * @route GET /
 * @description Get all employees that qualified with the optional parameters in  query.
 */
/**
 * @openapi
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     responses:
 *         200:
 *           description: All employess  matching the criteria
 *         500:
 *           description: Server error
 */
router.get("/", employeeController.getAllEmployees);

/**
 * @route GET /:id
 * @description Get an existing employee.
 */
/**
 * @openapi
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get an existing employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the employee to be found
 *     responses:
 *       200:
 *         description: The wanted employee
 *       404:
 *         description: No branch found with the specified id
 *       500:
 *         description: Server error
 */
router.get("/:id", employeeController.getEmployeeById);

/**
 * @route POST /
 * @description Create a new employee
 */
/**
 * @openapi
 * /api/v1/employees:
 *  post:
 *   summary: Create a new employee
 *   tags: [Employee]
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             position:
 *               type: string
 *             department:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             branchId:
 *               type: number
 *   responses:
 *    201:
 *     description: the new employee
 *    500:
 *     description: Server error
 */
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    validateRequest(employeeSchema("POST"))(req, res, next),
  employeeController.createEmployee
);

/**
 * @route PUT /:id
 * @description Update an existing employee.
 *
 * @openapi
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update an existing employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the employee to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                   type: string
 *               branchId:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated employee
 *       404:
 *         description: No employee found with the specified id
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    validateRequest(employeeSchema("PUT"))(req, res, next),
  employeeController.updateEmployee
);

/**
 * @route DELETE /:id
 * @description Delete an employee profile.
 */
/**
 * @openapi
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete an existing employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the employee to be deleted
 *     responses:
 *       200:
 *         description: Delete successfully
 *       404:
 *         description: No employee found with the specified id
 *       500:
 *         description: Server error
 */
router.delete("/:id", employeeController.deleteEmployee);

export default router;
