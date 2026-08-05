export interface SearchApplicantsDto {

    /** Matches only against REAL, verified skills - never a student's self-declared, unverified skill claim. */
    skillNames?: string[];

    minCgpa?: number;

}
