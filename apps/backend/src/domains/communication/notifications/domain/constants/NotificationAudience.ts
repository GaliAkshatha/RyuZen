export enum NotificationAudience {

    ALL = "ALL",

    ORG_ADMIN = "ORG_ADMIN",

    FACULTY = "FACULTY",

    STUDENT = "STUDENT",

    ALUMNI = "ALUMNI",

    /**
     * Not a broadcast audience — used only for system-generated
     * notifications aimed at exactly one recipient (see
     * RecordSystemNotificationUseCase and `recipientUserId` on
     * INotification). Deliberately never matches
     * findForAudience's `{targetAudience: {$in: ["ALL", role]}}`
     * query, since no role is ever literally named "TARGETED" — these
     * notifications only surface via the separate recipientUserId
     * match.
     */
    TARGETED = "TARGETED"

}
