import { Express } from "express";

import { bootstrapMiddleware } from "./middleware.js";
import { bootstrapRoutes } from "./routes.js";

export function bootstrap(app: Express): void {
    bootstrapMiddleware(app);

    bootstrapRoutes(app);
}