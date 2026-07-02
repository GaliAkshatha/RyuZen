
/*  Activity Types */

export const ACTIVITY_TYPE = Object.freeze({

    FORM: "form",

    WORKSHOP: "workshop",

    ASSIGNMENT: "assignment",

    HACKATHON: "hackathon",

    SEMINAR: "seminar",

    QUIZ: "quiz",

    PLACEMENT_DRIVE: "placement_drive",

});


/*  Activity Status  */


export const ACTIVITY_STATUS = Object.freeze({

    DRAFT: "draft",

    PUBLISHED: "published",

    ACTIVE: "active",

    CLOSED: "closed",

    ARCHIVED: "archived",

});


/* Submission Status  */

export const SUBMISSION_STATUS = Object.freeze({

    REGISTERED: "registered",

    SUBMITTED: "submitted",

    UNDER_REVIEW: "under_review",

    APPROVED: "approved",

    REJECTED: "rejected",

    COMPLETED: "completed",

});


/*  Attendance Method  */


export const ATTENDANCE_METHOD = Object.freeze({

    QR: "qr",

    MANUAL: "manual",

    GPS: "gps",

});

/*  Assignment Submission  */

export const SUBMISSION_TYPE = Object.freeze({

    PDF: "pdf",

    ZIP: "zip",

    LINK: "link",

    IMAGE: "image",

});


/* Activity Visibility */


export const ACTIVITY_VISIBILITY = Object.freeze({

    PUBLIC: "public",

    PRIVATE: "private",

});