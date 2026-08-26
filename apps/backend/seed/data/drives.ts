import { PlacementDriveModel } from "../../src/domains/placements/drives/infrastructure/persistence/PlacementDriveModel.js";
import { PlacementDriveStatus } from "../../src/domains/placements/drives/domain/constants/PlacementDriveStatus.js";

import { pick, pickMany, randomInt, chance } from "../utils/random.js";
import type { SeededOrganization, SeededCompany, SeededDrive } from "../types.js";

const ROLE_TITLES = ["Software Engineer", "Data Analyst", "Product Associate", "QA Engineer", "Backend Developer"];

/**
 * Creates 2-3 real placement drives per organization, one per
 * assigned company, with a genuine mix of DRAFT/PUBLISHED/CLOSED and
 * real, enforced eligibilityCriteria on most of them (department,
 * batch, minSemester, minCgpa - the same real fields
 * isStudentEligibleForDrive actually checks, confirmed directly).
 *
 * guaranteedCompanyId is a real, confirmed fix: seedRecruiters
 * independently picks 3 random companies for recruiters, and this
 * function independently picks its own 3 random companies for
 * drives - two unrelated random selections with no guarantee of
 * overlap. Left alone, the demo-designated recruiter
 * (recruiter1@<code>.edu) could easily be assigned a company that
 * simply never receives a drive at all, landing demo visitors on a
 * recruiter account with a completely empty pipeline. Passing that
 * recruiter's real companyId here guarantees their company is always
 * included, filling the remaining slots randomly as before.
 */
export async function seedDrives(org: SeededOrganization, companies: SeededCompany[], guaranteedCompanyId?: string): Promise<SeededDrive[]> {
  const results: SeededDrive[] = [];

  const guaranteed = guaranteedCompanyId ? companies.find((c) => c.id === guaranteedCompanyId) : undefined;
  const remainingSlots = Math.max(0, Math.min(3, companies.length) - (guaranteed ? 1 : 0));
  const otherCompanies = pickMany(
    companies.filter((c) => c.id !== guaranteedCompanyId),
    remainingSlots,
  );
  const driveCompanies = guaranteed ? [guaranteed, ...otherCompanies] : otherCompanies;

  for (const company of driveCompanies) {
    const isGuaranteed = guaranteed && company.id === guaranteed.id;
    const title = `${pick(ROLE_TITLES)} — ${company.name}`;
    const status = isGuaranteed
      ? PlacementDriveStatus.PUBLISHED
      : pick([
          PlacementDriveStatus.PUBLISHED,
          PlacementDriveStatus.PUBLISHED,
          PlacementDriveStatus.CLOSED,
          PlacementDriveStatus.DRAFT,
        ]);

    const hasEligibility = chance(0.7);

    const drive = await PlacementDriveModel.create({
      organizationId: org.id,
      companyId: company.id,
      title,
      description: `${company.name} is hiring for ${title} - real, hands-on work across our core product.`,
      package: `${randomInt(4, 18)} LPA`,
      location: pick(["Bengaluru", "Hyderabad", "Pune", "Remote"]),
      eligibility: hasEligibility ? "See structured criteria" : undefined,
      eligibilityCriteria: hasEligibility
        ? {
            departmentIds: [pick(org.departments).id],
            minCgpa: pick([6, 6.5, 7, 7.5]),
            minSemester: pick([5, 6]),
            batches: chance(0.5) ? [pick(["2022-2026", "2023-2027"])] : undefined,
          }
        : undefined,
      deadline: new Date(Date.now() + randomInt(7, 45) * 24 * 60 * 60 * 1000),
      status,
    });

    results.push({ id: drive._id.toString(), title, companyId: company.id, status });
  }

  console.log(`Seed: created ${results.length} placement drives for "${org.name}"`);
  return results;
}
