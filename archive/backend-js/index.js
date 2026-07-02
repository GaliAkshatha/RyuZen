import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/shared/config/db.js";

import authRoutes from "./src/domains/auth/routes/authRoutes.js";

import activityRoutes from "./src/domains/activities/routes/activityRoutes.js";
import notificationRoutes from "./src/domains/notifications/routes/notificationRoutes.js";
import leaderboardRoutes from "./src/domains/leaderboard/routes/leaderboardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/leaderboard",leaderboardRoutes);
app.use("/api/chat",chatRoutes);

app.get("/", (req,res)=>{
    res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});