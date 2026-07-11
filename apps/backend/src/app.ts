import express, { Express } from "express";

import { bootstrap } from "./bootstrap/index.js";
import { errorHandler } from "./shared/core/http/index.js";
import { notFound } from "./shared/core/middleware/notFound.js";

import authRoutes from "../src/domains/identity/presentation/routes/auth.routes.js";
import organizationRoutes from "./domains/organizations/presentation/routes/organization.routes.js";
import activityRoutes from "./domains/academic/activities/presentation/routes/activity.routes.js";
import submissionRoutes from "./domains/academic/submissions/presentation/routes/submission.routes.js";
import departmentRoutes from "./domains/organizations/departments/presentation/routes/department.routes.js";
import facultyRoutes from "./domains/organizations/faculty/presentation/routes/faculty.routes.js";

const app: Express = express();

bootstrap(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/submissions",submissionRoutes);
app.use(notFound);

app.use(errorHandler);

export default app;