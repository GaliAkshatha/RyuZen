/**
 * Real evidence text gathered from across the student's existing
 * records — Portfolio Projects, Certifications, Experience, and
 * approved Activity submissions — confirmed by reading each entity's
 * actual fields before designing this (see ExtractSkillsUseCase.ts).
 *
 * "Resume" is deliberately NOT a source here: the Resume entity only
 * stores a pointer (resumeUrl) to an externally-hosted file, not
 * parseable text — there is no real resume content in this domain to
 * extract from without adding file-download and document-parsing
 * infrastructure that doesn't currently exist. Rather than fabricate
 * that, this pipeline draws only from sources with real, already-
 * structured text in the database.
 */
export interface SkillExtractionInput {

    projects: {
        title: string;
        description?: string;
        techStack: string[];
    }[];

    certifications: {
        title: string;
        issuer: string;
        skills: string[];
    }[];

    experience: {
        role: string;
        company: string;
        description?: string;
    }[];

    completedActivityTitles: string[];

    /** Names of skills the student already has (approved or not) - the provider must not re-suggest these. */
    existingSkillNames: string[];

}
