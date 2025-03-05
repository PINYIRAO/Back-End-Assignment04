// import the express application and type definition
import express, { Express } from "express";
// Importing morgan
import { accessLogger } from "./api/v1/middleware/logger";
// import setupSwagger endpoint
import setupSwagger from "../config/swagger";
// import middleware
import errorHandler from "./api/v1/middleware/errorHandler";
// import routes
import healthRoutes from "./api/v1/routes/healthRoutes";
import employeeRoutes from "./api/v1/routes/employeeRoutes";
import branchRoutes from "./api/v1/routes/branchRoutes";

// initialize the express application
const app: Express = express();

// setup swagger for api documentation
setupSwagger(app);

app.use(express.json());

// Use morgan for HTTP request logging
app.use(accessLogger);

app.use("/health", healthRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/branches", branchRoutes);

// apply error handling middleware
app.use(errorHandler);

// export app and server for testing
export default app;
