import { ConnectionRequestModel } from "../../src/domains/community/connections/infrastructure/persistence/ConnectionRequestModel.js";

import { chance, pickMany } from "../utils/random.js";
import type { SeededFaculty, SeededStudent, SeededAlumnus } from "../types.js";

/**
 * Creates real connection requests across Student/Faculty/Alumni -
 * ORG_ADMIN and SUPER_ADMIN are deliberately excluded from ever being
 * a from/to participant here, confirmed against
 * GetConnectableUsersUseCase/SendConnectionRequestUseCase, which
 * exclude both roles from the real directory entirely. A genuine mix
 * of ACCEPTED (real connections, visible in "My Connections") and
 * PENDING (real, actionable incoming requests) - not all one state.
 */
export async function seedConnections(
  organizationId: string,
  students: SeededStudent[],
  faculty: SeededFaculty[],
  alumni: SeededAlumnus[],
): Promise<void> {
  const activeAlumniUserIds = alumni.filter((a) => a.userId).map((a) => a.userId!);
  const pool = [...students.map((s) => s.userId), ...faculty.map((f) => f.userId), ...activeAlumniUserIds];

  if (pool.length < 2) return;

  let created = 0;
  const pairsUsed = new Set<string>();

  for (const fromUserId of pool) {
    const candidates = pool.filter((id) => id !== fromUserId);
    const targets = pickMany(candidates, 2);

    for (const toUserId of targets) {
      const pairKey = [fromUserId, toUserId].sort().join("-");
      if (pairsUsed.has(pairKey)) continue;
      pairsUsed.add(pairKey);

      const status = chance(0.6) ? "ACCEPTED" : "PENDING";

      await ConnectionRequestModel.create({
        organizationId,
        fromUserId,
        toUserId,
        status,
        respondedAt: status === "ACCEPTED" ? new Date() : undefined,
      });

      created++;
    }
  }

  console.log(`Seed: created ${created} connections/requests`);
}
