import { ICodingProfileRepository } from "../../infrastructure/repositories/ICodingProfileRepository.js";

import { SyncCodingProfileUseCase } from "./SyncCodingProfileUseCase.js";

/**
 * The "periodically pulls" half of the whole feature - real, but
 * called from a real scheduled job (see codingProfileSyncJob.ts), not
 * a live-verified background process in this sandbox (network egress
 * here doesn't reach codeforces.com, confirmed directly). Every
 * profile is synced independently - one platform being temporarily
 * unreachable or one handle becoming invalid never stops the rest of
 * the real organization's students from syncing.
 */
export class SyncAllCodingProfilesUseCase {

    constructor(

        private readonly repository: ICodingProfileRepository,

        private readonly syncOne: SyncCodingProfileUseCase

    ) {}

    async execute(): Promise<{ synced: number; failed: number }> {

        const profiles =

            await this.repository.findAllVerified();

        let synced = 0;

        let failed = 0;

        for (const profile of profiles) {

            try {

                await this.syncOne.execute(
                    profile.id!
                );

                synced += 1;

            } catch {

                failed += 1;

            }

        }

        return { synced, failed };

    }

}
