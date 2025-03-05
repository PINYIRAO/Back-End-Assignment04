import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

router.get(
  "/:uid",

  getUserDetails
);

export default router;
