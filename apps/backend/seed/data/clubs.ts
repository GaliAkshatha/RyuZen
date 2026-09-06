import { ClubModel } from "../../src/domains/campus/clubs/infrastructure/persistence/ClubModel.js";
import { ClubMemberModel } from "../../src/domains/campus/clubs/infrastructure/persistence/ClubMemberModel.js";

import { pick, pickMany, randomInt } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent, SeededClub } from "../types.js";

const CLUB_TEMPLATES: { name: string; code: string; description: string }[] = [
  {
    name: "Coding Club",
    code: "CODE",
    description: "Weekly problem-solving sessions, competitive programming practice, and a real path into open source contribution.",
  },
  {
    name: "Robotics Club",
    code: "ROBO",
    description: "Building and competing with real autonomous robots - from wiring to control software.",
  },
  {
    name: "Entrepreneurship Cell",
    code: "ECELL",
    description: "Pitch practice, startup mentorship, and a real annual pitch competition with actual industry judges.",
  },
  {
    name: "Literary & Debate Society",
    code: "LITSOC",
    description: "Debates, creative writing workshops, and the campus's own literary magazine.",
  },
  {
    name: "Music & Arts Club",
    code: "ARTS",
    description: "Open jam sessions, a real annual cultural fest performance slot, and instrument-sharing for beginners.",
  },
];

/**
 * Real clubs, each with a genuine faculty advisor, a real president +
 * vice president (both actual students, not placeholders), and a
 * real member roster - not just empty shells. The demo-designated
 * student (student1) is deliberately guaranteed membership in the
 * first club, matching the same guarantee pattern already used for
 * activities/drives elsewhere in this seed - otherwise the club
 * detail page a demo viewer lands on could show them as a stranger to
 * every club that exists.
 */
export async function seedClubs(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  students: SeededStudent[],
): Promise<SeededClub[]> {
  const results: SeededClub[] = [];

  const demoStudent = students.find((s) => s.email.startsWith("student1@"));

  for (const [index, template] of CLUB_TEMPLATES.entries()) {
    const advisor = pick(faculty);
    const pool = pickMany(students, students.length);

    const president = pool[0]!;
    const vicePresident = pool[1]!;
    const memberCount = randomInt(4, 8);
    const regularMembers = pool.slice(2, 2 + memberCount);

    const club = await ClubModel.create({
      organizationId: org.id,
      name: template.name,
      code: template.code,
      description: template.description,
      facultyAdvisorId: advisor.facultyId,
      presidentStudentId: president.studentId,
      vicePresidentStudentId: vicePresident.studentId,
      status: "ACTIVE",
    });

    await ClubMemberModel.create({
      clubId: club._id,
      studentId: president.studentId,
      role: "PRESIDENT",
      joinedAt: new Date(Date.now() - randomInt(60, 300) * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    });

    await ClubMemberModel.create({
      clubId: club._id,
      studentId: vicePresident.studentId,
      role: "VICE_PRESIDENT",
      joinedAt: new Date(Date.now() - randomInt(60, 300) * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    });

    for (const member of regularMembers) {
      await ClubMemberModel.create({
        clubId: club._id,
        studentId: member.studentId,
        role: "MEMBER",
        joinedAt: new Date(Date.now() - randomInt(10, 250) * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      });
    }

    // Guarantee the demo student has real, visible membership in the
    // first club specifically - not just a random chance of overlap.
    if (
      index === 0 &&
      demoStudent &&
      demoStudent.studentId !== president.studentId &&
      demoStudent.studentId !== vicePresident.studentId &&
      !regularMembers.some((m) => m.studentId === demoStudent.studentId)
    ) {
      await ClubMemberModel.create({
        clubId: club._id,
        studentId: demoStudent.studentId,
        role: "MEMBER",
        joinedAt: new Date(Date.now() - randomInt(30, 120) * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      });
    }

    results.push({
      id: club._id.toString(),
      name: template.name,
      code: template.code,
    });
  }

  return results;
}
