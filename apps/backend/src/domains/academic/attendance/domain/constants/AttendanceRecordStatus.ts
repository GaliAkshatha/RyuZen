export enum AttendanceRecordStatus {

    PRESENT = "PRESENT",

    LATE = "LATE",

    ABSENT = "ABSENT",

    /** A genuinely approved absence (medical leave, official duty, etc.) - the student was not physically present, but the absence doesn't count against them. Distinct from correcting ABSENT to PRESENT, which claims they actually attended. */
    EXCUSED = "EXCUSED"

}
