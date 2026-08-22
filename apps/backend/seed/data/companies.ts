import { CompanyModel } from "../../src/domains/placements/companies/infrastructure/persistence/CompanyModel.js";
import { CompanyStatus } from "../../src/domains/placements/companies/domain/constants/CompanyStatus.js";

import { pickMany } from "../utils/random.js";
import type { SeededOrganization, SeededCompany } from "../types.js";

/** Fictional company names, not real employers - each organization gets its own independent set (no shared companyId across orgs, matching real tenant isolation). */
const COMPANY_POOL = [
  "Nimbus Softworks", "Vertex Cloudlabs", "Orbital Data Systems", "Quanta Robotics",
  "Silverleaf Analytics", "Brightpath Technologies", "Ironforge Systems", "Lumen Digital",
];

/** Creates 3-4 real companies per organization. */
export async function seedCompanies(org: SeededOrganization): Promise<SeededCompany[]> {
  const names = pickMany(COMPANY_POOL, 4);
  const results: SeededCompany[] = [];

  for (const name of names) {
    const company = await CompanyModel.create({
      organizationId: org.id,
      name,
      hrName: `${name} HR Team`,
      hrEmail: `hr@${name.toLowerCase().replace(/\s+/g, "")}.com`,
      status: CompanyStatus.ACTIVE,
    });
    results.push({ id: company._id.toString(), name: company.name });
  }

  console.log(`Seed: created ${results.length} companies for "${org.name}"`);
  return results;
}
