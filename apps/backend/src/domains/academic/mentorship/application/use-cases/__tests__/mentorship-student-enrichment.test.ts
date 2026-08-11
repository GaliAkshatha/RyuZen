import { describe, it, expect } from "vitest";

import { GetMentorshipUseCase } from "../GetMentorshipUseCase.js";

/**
 * Regression test for a real bug found while auditing Faculty's "My
 * Students" flow: MentorshipDetailPage called the admin-only GET
 * /students directly to resolve a student's display name, which 403s
 * for a Faculty caller and silently falls back to a raw id. Fixed by
 * enriching the response server-side (the same pattern already
 * applied to GetMentorshipsUseCase and GetLeaderboardUseCase).
 */
describe("Mentorship: single-record student name enrichment", () => {
  const mentorship = { id: "ment-1", organizationId: "org-1", studentId: "student-1", facultyId: "fac-1", status: "ACTIVE" };
  const student = { id: "student-1", userId: "user-student-1", usn: "1AB20CS001" };
  const user = { id: "user-student-1", name: "Alice Kumar" };

  function makeUseCase() {
    const mentorshipRepo = { async findById(id: string) { return id === "ment-1" ? mentorship : null; } };
    const studentRepo = { async findById(id: string) { return id === "student-1" ? student : null; } };
    const userRepo = { async findById(id: string) { return id === "user-student-1" ? user : null; } };
    return new GetMentorshipUseCase(mentorshipRepo as any, studentRepo as any, userRepo as any);
  }

  it("enriches the response with the real student's name and usn", async () => {
    const useCase = makeUseCase();
    const result = await useCase.execute("ment-1", "org-1");

    expect(result.studentName).toBe("Alice Kumar");
    expect(result.studentUsn).toBe("1AB20CS001");
  });

  it("rejects a mentorship belonging to a different organization", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute("ment-1", "org-2")).rejects.toMatchObject({ statusCode: 404 });
  });
});
