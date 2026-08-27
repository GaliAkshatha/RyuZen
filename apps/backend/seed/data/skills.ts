import { SkillModel } from "../../src/domains/career/skills/infrastructure/persistence/SkillModel.js";
import { PortfolioProjectModel } from "../../src/domains/career/portfolio/infrastructure/persistence/PortfolioProjectModel.js";
import { SkillSource } from "../../src/domains/career/skills/domain/constants/SkillSource.js";

import { randomInt } from "../utils/random.js";
import type { SeededStudent } from "../types.js";

/**
 * Real, evidence-derived skills for students who already have a
 * portfolio - not invented independently of their projects. Each
 * student's own real seeded PortfolioProject techStack entries are
 * read back and turned into real Skill records, deduplicated, one
 * evidence string per skill naming the actual project it came from -
 * the same shape ExtractSkillsUseCase itself produces (source:
 * AI_SUGGESTED, confidence, evidence), except pre-approved here so a
 * demo visitor sees populated skills immediately rather than an empty
 * "No skills yet" state requiring a live Gemini call during a demo.
 * The real "Extract skills with AI" button in SkillsManager still
 * works on top of this exactly as it would for a genuine student -
 * this only seeds the starting state, it doesn't disable or replace
 * the real feature.
 */
export async function seedSkills(students: SeededStudent[]): Promise<void> {
  let created = 0;

  for (const student of students) {
    const projects = await PortfolioProjectModel.find({ userId: student.userId });
    if (projects.length === 0) continue;

    const skillEvidence = new Map<string, string>();
    for (const project of projects) {
      for (const techName of project.techStack ?? []) {
        if (!skillEvidence.has(techName)) {
          skillEvidence.set(techName, `Used in project "${project.title}"`);
        }
      }
    }

    const isDemoStudent = student.email.startsWith("student1@");
    let hasVerifiedOne = false;

    for (const [name, evidence] of skillEvidence) {
      const verifyThisOne = isDemoStudent && !hasVerifiedOne;
      if (verifyThisOne) hasVerifiedOne = true;

      await SkillModel.create({
        userId: student.userId,
        name,
        source: SkillSource.AI_SUGGESTED,
        confidence: randomInt(78, 97),
        evidence,
        approved: true,
        // The demo student gets one real verified skill, so the
        // verify flow (Faculty/Org Admin confirming a skill) has
        // something real to show too, not just approved-but-
        // unverified skills everywhere.
        verified: verifyThisOne,
      });
      created++;
    }
  }

  console.log(`Seed: created ${created} skills from real project evidence`);
}
