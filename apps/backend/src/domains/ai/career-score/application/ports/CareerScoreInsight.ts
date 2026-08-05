export interface CareerScoreInsight {

    label: string;

    narrative: string;

    /** 2-5 specific, actionable next steps based on this student's real score breakdown. */
    recommendations: string[];

    /** 2-4 sequential milestones toward improving this student's score, ordered by what to tackle first. */
    roadmap: string[];

}
