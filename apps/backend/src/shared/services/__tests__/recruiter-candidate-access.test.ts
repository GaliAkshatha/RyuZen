import { describe, it, expect } from "vitest";

import { RecruiterCandidateAccessService } from "../RecruiterCandidateAccessService.js";

/**
 * BUSINESS-LOGIC REGRESSION TEST: the one real authorization rule
 * behind opening Career Score, Resume, and AI Interview results to
 * RECRUITER - a recruiter may only view a candidate who has
 * genuinely applied to one of their own company's real placement
 * drives, not any student in the organization, and not applicants of
 * a different company's drives even within the same org.
 */
describe("RecruiterCandidateAccessService", () => {
  function makeService(opts: {
    recruiter?: { id: string; companyId: string } | null;
    student?: { id: string } | null;
    companyDrives?: { id: string }[];
    applications?: { placementId: string }[];
  }) {
    const recruiterRepository = {
      async findByUserId() {
        return opts.recruiter ?? null;
      },
    };
    const placementDriveRepository = {
      async findByOrganization() {
        return opts.companyDrives ?? [];
      },
    };
    const studentRepository = {
      async findByUserId() {
        return opts.student ?? null;
      },
    };
    const jobApplicationRepository = {
      async findByStudent() {
        return opts.applications ?? [];
      },
    };

    return new RecruiterCandidateAccessService(
      recruiterRepository as any,
      placementDriveRepository as any,
      studentRepository as any,
      jobApplicationRepository as any,
    );
  }

  it("grants access when the candidate has genuinely applied to the recruiter's own company's drive", async () => {
    const service = makeService({
      recruiter: { id: "rec-1", companyId: "company-A" },
      student: { id: "student-1" },
      companyDrives: [{ id: "drive-A1" }, { id: "drive-A2" }],
      applications: [{ placementId: "drive-A2" }],
    });

    const result = await service.canRecruiterViewCandidate("user-recruiter", "org-1", "user-student");
    expect(result).toBe(true);
  });

  it("denies access when the candidate applied only to a different company's drive", async () => {
    const service = makeService({
      recruiter: { id: "rec-1", companyId: "company-A" },
      student: { id: "student-1" },
      companyDrives: [{ id: "drive-A1" }],
      applications: [{ placementId: "drive-B1" }],
    });

    const result = await service.canRecruiterViewCandidate("user-recruiter", "org-1", "user-student");
    expect(result).toBe(false);
  });

  it("denies access when the candidate has no applications at all", async () => {
    const service = makeService({
      recruiter: { id: "rec-1", companyId: "company-A" },
      student: { id: "student-1" },
      companyDrives: [{ id: "drive-A1" }],
      applications: [],
    });

    const result = await service.canRecruiterViewCandidate("user-recruiter", "org-1", "user-student");
    expect(result).toBe(false);
  });

  it("denies access when the caller does not resolve to a real recruiter", async () => {
    const service = makeService({
      recruiter: null,
      student: { id: "student-1" },
      companyDrives: [{ id: "drive-A1" }],
      applications: [{ placementId: "drive-A1" }],
    });

    const result = await service.canRecruiterViewCandidate("user-not-a-recruiter", "org-1", "user-student");
    expect(result).toBe(false);
  });

  it("denies access when the target does not resolve to a real student", async () => {
    const service = makeService({
      recruiter: { id: "rec-1", companyId: "company-A" },
      student: null,
      companyDrives: [{ id: "drive-A1" }],
      applications: [],
    });

    const result = await service.canRecruiterViewCandidate("user-recruiter", "org-1", "user-not-a-student");
    expect(result).toBe(false);
  });
});
