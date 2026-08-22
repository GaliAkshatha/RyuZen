import { IRecruiterRepository } from "../../domains/placements/recruiters/infrastructure/repositories/IRecruiterRepository.js";
import { IPlacementDriveRepository } from "../../domains/placements/drives/infrastructure/repositories/IPlacementDriveRepository.js";
import { IStudentRepository } from "../../domains/academic/students/infrastructure/repositories/IStudentRepository.js";
import { IJobApplicationRepository } from "../../domains/placements/applications/infrastructure/repositories/IJobApplicationRepository.js";

/**
 * The one real authorization rule behind opening Career Score,
 * Resume, and AI Interview results to RECRUITER: a recruiter may only
 * view a candidate who has genuinely applied to one of their own
 * company's real placement drives - not any student in the
 * organization. Lives in shared/ deliberately, not inside any single
 * one of the three domains that depend on it (ai/career-score,
 * career/resume, ai/interview) - none of those domains should know
 * about placements/recruiters internals, and this rule belongs to
 * none of them individually. A real cross-domain concern gets a real
 * shared home, not duplicated three times or bolted onto one domain
 * arbitrarily.
 */
export class RecruiterCandidateAccessService {
  constructor(
    private readonly recruiterRepository: IRecruiterRepository,
    private readonly placementDriveRepository: IPlacementDriveRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly jobApplicationRepository: IJobApplicationRepository,
  ) {}

  async canRecruiterViewCandidate(recruiterUserId: string, organizationId: string, candidateUserId: string): Promise<boolean> {
    const recruiter = await this.recruiterRepository.findByUserId(recruiterUserId);
    if (!recruiter) return false;

    const student = await this.studentRepository.findByUserId(candidateUserId);
    if (!student) return false;

    const companyDrives = await this.placementDriveRepository.findByOrganization(organizationId, {
      companyId: recruiter.companyId,
    });
    const companyDriveIds = new Set(companyDrives.map((d) => d.id));

    const applications = await this.jobApplicationRepository.findByStudent(student.id!);
    return applications.some((app) => companyDriveIds.has(app.placementId));
  }
}
