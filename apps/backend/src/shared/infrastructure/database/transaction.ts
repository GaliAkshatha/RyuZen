import mongoose from "mongoose";

export async function startTransaction() {
    const session = await mongoose.startSession();

    session.startTransaction();

    return session;
}