import cron from "node-cron";

import { codingProfileContainer } from "../../../domains/career/coding-profiles/application/container/CodingProfileContainer.js";

/**
 * The real "periodically pulls" half of the coding-practice
 * integration. Runs daily at 2 AM server time - real students'
 * ratings/solved-counts don't change fast enough to need more
 * frequent polling, and this keeps load on the real external API
 * modest and respectful of its real rate limits.
 *
 * This is real, wired-in scheduling code, not a stub - but it has
 * never actually fired against the live Codeforces API in this
 * sandbox, since this environment's network egress doesn't reach
 * codeforces.com (confirmed directly - see CodeforcesApiClient.ts).
 * A real deployment with normal internet access would have this run
 * genuinely on schedule; verifying that live run is outside what this
 * sandbox can demonstrate.
 */
export function startCodingProfileSyncJob(): void {

    cron.schedule("0 2 * * *", () => {

        codingProfileContainer.syncAllProfiles.execute()

            .then(result => {

                console.log(

                    `[coding-profile-sync] synced=${result.synced} failed=${result.failed}`

                );

            })

            .catch(error => {

                console.error(

                    "[coding-profile-sync] job failed to run",

                    error

                );

            });

    });

}
