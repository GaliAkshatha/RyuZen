import { describe, it, expect } from "vitest";

import { ScheduleInterviewRoundUseCase } from "../ScheduleInterviewRoundUseCase.js";
import { RecordInterviewEvaluationUseCase } from "../RecordInterviewEvaluationUseCase.js";
import { InterviewRound } from "../../../domain/entities/InterviewRound.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * Real, persistent regression test for a real multi-tenancy/scope
 * rule: a recruiter can only schedule or evaluate interview rounds
 * for applications to drives at their OWN real company - not any
 * drive in the organization. This was the deliberately-deferred gap
 * from the original recruiter build, closed earlier this session, and
 * previously verified only via a disposable smoke-test script. Made
 * permanent here per the Testing Strategy's priority on
 * Security/Authorization/Multi-tenancy tests.
 */
describe("Interview Rounds: recruiter company-scope boundary", () => {
  const application = { id: "app-1", placementId: "drive-1", studentId: "student-1" };
  const drive = { id: "drive-1", organizationId: "org-1", companyId: "company-A", title: "SWE Drive" };
  const student = { id: "student-1", userId: "user-student-1" };

  const recruiters: Record<string, any> = {
    "recruiter-right-company": { organizationId: "org-1", companyId: "company-A" },
    "recruiter-wrong-company": { organizationId: "org-1", companyId: "company-B" },
  };

  function makeFakes() {
    const applicationRepo = { async findById(id: string) { return id === "app-1" ? application : null; } };
    const driveRepo = { async findById(id: string) { return id === "drive-1" ? drive : null; } };
    const studentRepo = { async findById(id: string) { return id === "student-1" ? student : null; } };
    const recruiterRepo = { async findByUserId(userId: string) { return recruiters[userId] ?? null; } };
    const notif = { async execute() {} };
    const growth = { async execute() {} };

    let createdRound: InterviewRound | null = null;
    const roundRepo = {
      async findByApplication() { return []; },
      async create(r: InterviewRound) {
        createdRound = InterviewRound.create({ ...r.toObject(), id: "round-1" });
        return createdRound;
      },
      async findById(id: string) { return id === "round-1" ? createdRound : null; },
      async save(r: InterviewRound) { createdRound = r; return r; },
    };

    return { applicationRepo, driveRepo, studentRepo, recruiterRepo, notif, growth, roundRepo };
  }

  it("allows ORG_ADMIN to schedule a round regardless of company", async () => {
    const f = makeFakes();
    const useCase = new ScheduleInterviewRoundUseCase(
      f.roundRepo as any, f.applicationRepo as any, f.driveRepo as any, f.studentRepo as any, f.recruiterRepo as any, f.notif as any,
    );

    const result = await useCase.execute(
      "org-1", { applicationId: "app-1", roundType: "TECHNICAL_1" } as any, "admin-1", UserRole.ORG_ADMIN,
    );

    expect(result.applicationId).toBe("app-1");
  });

  it("allows a recruiter from the drive's real company to schedule", async () => {
    const f = makeFakes();
    const useCase = new ScheduleInterviewRoundUseCase(
      f.roundRepo as any, f.applicationRepo as any, f.driveRepo as any, f.studentRepo as any, f.recruiterRepo as any, f.notif as any,
    );

    await expect(
      useCase.execute(
        "org-1", { applicationId: "app-1", roundType: "TECHNICAL_2" } as any, "recruiter-right-company", UserRole.RECRUITER,
      ),
    ).resolves.toBeDefined();
  });

  it("rejects a recruiter from a DIFFERENT company (404, not leaked)", async () => {
    const f = makeFakes();
    const useCase = new ScheduleInterviewRoundUseCase(
      f.roundRepo as any, f.applicationRepo as any, f.driveRepo as any, f.studentRepo as any, f.recruiterRepo as any, f.notif as any,
    );

    await expect(
      useCase.execute(
        "org-1", { applicationId: "app-1", roundType: "TECHNICAL_2" } as any, "recruiter-wrong-company", UserRole.RECRUITER,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("applies the same company-scope boundary to evaluation", async () => {
    const f = makeFakes();
    const scheduleUseCase = new ScheduleInterviewRoundUseCase(
      f.roundRepo as any, f.applicationRepo as any, f.driveRepo as any, f.studentRepo as any, f.recruiterRepo as any, f.notif as any,
    );
    const evaluateUseCase = new RecordInterviewEvaluationUseCase(
      f.roundRepo as any, f.applicationRepo as any, f.studentRepo as any, f.driveRepo as any, f.recruiterRepo as any, f.growth as any, f.notif as any,
    );

    await scheduleUseCase.execute(
      "org-1", { applicationId: "app-1", roundType: "TECHNICAL_1" } as any, "recruiter-right-company", UserRole.RECRUITER,
    );

    await expect(
      evaluateUseCase.execute(
        "round-1", "org-1",
        { passed: true, rating: 5, strengths: "", weaknesses: "", notes: "" } as any,
        "recruiter-wrong-company", UserRole.RECRUITER,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });

    await expect(
      evaluateUseCase.execute(
        "round-1", "org-1",
        { passed: true, rating: 5, strengths: "", weaknesses: "", notes: "" } as any,
        "recruiter-right-company", UserRole.RECRUITER,
      ),
    ).resolves.toBeDefined();
  });
});
