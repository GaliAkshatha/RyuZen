import { EventStatus } from "../constants/EventStatus.js";

export interface IEvent {

    id?: string;

    organizationId: string;

    clubId?: string;

    createdBy: string;

    title: string;

    description: string;

    venue?: string;

    startDate: Date;

    endDate: Date;

    registrationDeadline?: Date;

    capacity?: number;

    points: number;

    certificateEnabled: boolean;

    status: EventStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
