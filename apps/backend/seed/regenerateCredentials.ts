import { fileURLToPath } from "url";

import { OrganizationModel } from "../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { recordExistingOrgCredentials } from "./utils/recordExistingCredentials.js";
import { generateCredentialsFile } from "./generateCredentialsFile.js";

/**
 * Read-only recovery script - creates and modifies nothing. Every
 * seeded account shares one known password, so the full credentials
 * table is genuinely reconstructable from what's already in the
 * database - this exists specifically for the case where seeding
 * itself fully succeeded but the final credentials-file write failed
 * or was skipped, without needing to re-run (and duplicate) the seed.
 * Reuses the same recordExistingOrgCredentials utility index.ts calls
 * for organizations it finds already exist, so this logic lives in
 * exactly one place.
 */
async function main(): Promise<void> {
  console.log("Regenerating credentials file from existing database data (read-only, nothing is created or modified)\n");

  await connectForSeed();

  const organizations = await OrganizationModel.find({});

  for (const org of organizations) {
    await recordExistingOrgCredentials(org._id.toString(), org.name);
  }

  const credentialsPath = fileURLToPath(new URL("../SEED_CREDENTIALS.md", import.meta.url));
  await generateCredentialsFile(credentialsPath);

  await disconnectAfterSeed();

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("Failed to regenerate credentials file");
  console.error(error);
  process.exit(1);
});
