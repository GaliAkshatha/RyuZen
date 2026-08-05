/**
 * The real recruitment lifecycle: Online Assessment -> Technical
 * Round 1 -> Technical Round 2 -> Managerial Round -> HR Round ->
 * Offer Decision. Offer Decision itself is NOT a round here - it's
 * the JobApplication's own status (SELECTED/REJECTED), which already
 * exists and is where the final outcome genuinely lives - a round
 * is a real step IN the process, not the process's conclusion.
 */
export enum InterviewRoundType {

    ONLINE_ASSESSMENT = "ONLINE_ASSESSMENT",

    TECHNICAL_1 = "TECHNICAL_1",

    TECHNICAL_2 = "TECHNICAL_2",

    MANAGERIAL = "MANAGERIAL",

    HR = "HR"

}
