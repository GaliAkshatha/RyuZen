import http from "http";

import app from "./app.js";
import { bootstrapDatabase } from "./bootstrap/database.js";
import { env } from "./config/index.js";

async function startServer(): Promise<void> {
    await bootstrapDatabase();

    const server = http.createServer(app);

    server.listen(env.PORT, () => {
        console.log(
            `🚀 Server running at http://localhost:${env.PORT}`
        );
    });
}

startServer();