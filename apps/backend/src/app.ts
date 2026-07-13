import express, { Express } from "express";

import { bootstrap } from "./bootstrap/index.js";
import { errorHandler } from "./shared/core/http/index.js";
import { notFound } from "./shared/core/middleware/notFound.js";

import authRoutes from "../src/domains/identity/presentation/routes/auth.routes.js";
import userRoutes from "./domains/identity/presentation/routes/user.routes.js";
import organizationRoutes from "./domains/organizations/presentation/routes/organization.routes.js";
import activityRoutes from "./domains/academic/activities/presentation/routes/activity.routes.js";
import submissionRoutes from "./domains/academic/submissions/presentation/routes/submission.routes.js";
import auditLogRoutes from "./domains/platform/audit/presentation/routes/audit-log.routes.js";
import departmentRoutes from "./domains/academic/departments/presentation/routes/department.routes.js";
import facultyRoutes from "./domains/academic/faculty/presentation/routes/faculty.routes.js";
import studentRoutes from "./domains/academic/students/presentation/routes/student.routes.js";
import alumniRoutes from "./domains/academic/alumni/presentation/routes/alumni.routes.js";
import mentorshipRoutes from "./domains/academic/mentorship/presentation/routes/mentorship.routes.js";
import clubRoutes from "./domains/campus/clubs/presentation/routes/club.routes.js";
import eventRoutes from "./domains/campus/events/presentation/routes/event.routes.js";

const app: Express = express();

bootstrap(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/submissions",submissionRoutes);
app.use("/api/v1/audit-logs", auditLogRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/alumni", alumniRoutes);
app.use("/api/v1/mentorships", mentorshipRoutes);
app.use("/api/v1/clubs", clubRoutes);
app.use("/api/v1/events", eventRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;