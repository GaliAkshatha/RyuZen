/**
 * Codeforces is the only platform actually implemented - it has a
 * real, stable, official public API. LeetCode has no official public
 * API at all (most integrations scrape an unofficial GraphQL endpoint
 * that can break without notice); HackerRank's public API is limited.
 * The enum includes them as real future platforms, not implemented
 * ones - ICodingPlatformApiClient is built to be extended per-platform
 * without touching the domain model when that happens.
 */
export enum CodingPlatform {

    CODEFORCES = "CODEFORCES",

    LEETCODE = "LEETCODE",

    HACKERRANK = "HACKERRANK"

}
