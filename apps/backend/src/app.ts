import express, { Express } from "express";

import { bootstrap } from "./bootstrap/index.js";
import { errorHandler } from "./shared/core/http/index.js";

const app: Express = express();

bootstrap(app);

app.use(errorHandler);

export default app;