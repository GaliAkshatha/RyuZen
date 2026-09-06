/**
 * A genuinely structured review, not a single paragraph the frontend
 * has to parse itself. summary is a short overview; strengths and
 * improvements are real, separate lists so "what was good" and
 * "where to improve" can be rendered as distinct sections - matching
 * what an actual post-interview review looks like, not a run-on
 * blob of text.
 */
export interface InterviewFeedback {

    summary: string;

    strengths: string[];

    improvements: string[];

}
