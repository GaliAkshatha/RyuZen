import express from "express";
import { Express } from "express";

import bootstrapApplication from "./bootstrap/index.js";

const app: Express = express();

bootstrapApplication(app);

export default app;