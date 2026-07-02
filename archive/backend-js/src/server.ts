import http from "http";

import app from "./app.js";

import { env } from "./config/index.js";

const server = http.createServer(app);

server.listen(env.PORT, () => {
    console.log(` Server running on http://localhost:${env.PORT}`);
});