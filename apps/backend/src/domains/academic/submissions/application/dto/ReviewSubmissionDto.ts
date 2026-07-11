import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

export interface ReviewSubmissionDto {

    status:

        SubmissionStatus.APPROVED |

        SubmissionStatus.REJECTED;

    feedback: string;

    pointsAwarded: number;

}