import express, { Express } from "express";

import { bootstrap } from "./bootstrap/index.js";

const app: Express = express();

bootstrap(app);

export default app;