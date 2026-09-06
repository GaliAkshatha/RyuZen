export enum InterviewSessionStatus {

    IN_PROGRESS = "IN_PROGRESS",

    COMPLETED = "COMPLETED",

    /**
     * A real, honest distinction from COMPLETED: the candidate quit
     * before finishing all questions or the time limit was reached.
     * Still gets real feedback on whatever was actually answered
     * (see AbandonMockInterviewUseCase) - abandoning isn't a way to
     * avoid a low score, it's just recorded as what it actually was.
     */
    ABANDONED = "ABANDONED"

}
