import { Express } from "express";

export default function bootstrapApplication(app: Express): void {

    app.get("/health", (_req, res) => {

        res.status(200).json({

            success: true,

            message: "RyuZen Backend Running 🚀"

        });

    });

}