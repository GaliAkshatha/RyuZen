import mongoose from "mongoose";

import { connectDatabase } from "../../src/shared/infrastructure/database/index.js";

/** Reuses the exact same real connection helper the actual app boots with - no separate, parallel connection logic to drift out of sync. */
export async function connectForSeed(): Promise<void> {
  await connectDatabase();
  console.log("Seed: connected to MongoDB");
}

export async function disconnectAfterSeed(): Promise<void> {
  await mongoose.disconnect();
  console.log("Seed: disconnected from MongoDB");
}
