import { writeFile } from "fs/promises";
import { join } from "path";

import { getAllCredentials } from "./utils/credentialsLog.js";
import type { CredentialRow } from "./types.js";

const ROLE_ORDER = ["Org Admin", "Placement Admin", "Faculty", "Student", "Alumni", "Recruiter"];

function groupByOrganization(rows: CredentialRow[]): Map<string, CredentialRow[]> {
  const map = new Map<string, CredentialRow[]>();
  for (const row of rows) {
    const list = map.get(row.organization) ?? [];
    list.push(row);
    map.set(row.organization, list);
  }
  return map;
}

function renderOrgSection(orgName: string, rows: CredentialRow[]): string {
  const sorted = [...rows].sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));

  const lines = [`## ${orgName}`, "", "| Role | Name | Email | Password |", "|---|---|---|---|"];

  for (const row of sorted) {
    lines.push(`| ${row.role} | ${row.name} | \`${row.email}\` | \`${row.password}\` |`);
  }

  return lines.join("\n");
}

/**
 * Writes every real seeded account's login credentials to a single
 * markdown file - grouped by organization, ordered by role
 * (Org Admin first, Recruiter last) for easy scanning. Only accounts
 * with a genuine, real password (i.e. accounts that actually have a
 * User document and can log in) appear here - Alumni records left in
 * the real INVITED state deliberately have no row, since they have no
 * account to log into yet.
 */
export async function generateCredentialsFile(outputPath: string): Promise<void> {
  const rows = getAllCredentials();
  const grouped = groupByOrganization(rows);

  const sections = Array.from(grouped.entries()).map(([orgName, orgRows]) => renderOrgSection(orgName, orgRows));

  const content = [
    "# RyuZen Seed Data — Login Credentials",
    "",
    "Every account below was created by the seed script and can log in immediately.",
    "Alumni records seeded in the real INVITED state have no account yet and are not listed here.",
    "",
    ...sections.flatMap((s) => [s, ""]),
  ].join("\n");

  await writeFile(join(outputPath), content, "utf-8");
  console.log(`Seed: wrote credentials file to ${outputPath}`);
}
