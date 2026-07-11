import mongoose from "mongoose";

export function databaseHealth() {
    return {
        connected: mongoose.connection.readyState === 1,
        database: mongoose.connection.name,
    };
}