export interface IEventRegistration {

    id?: string;

    eventId: string;

    studentId: string;

    attendance: boolean;

    feedback?: string;

    certificateIssued: boolean;

    registeredAt: Date;

}
