import { CertificateRepository } from "../../infrastructure/repositories/CertificateRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    EventRepository,
} from "../../../events/infrastructure/repositories/EventRepository.js";

import {
    ActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/ActivityRepository.js";

import { IssueCertificateUseCase } from "../use-cases/IssueCertificateUseCase.js";
import { GetCertificateUseCase } from "../use-cases/GetCertificateUseCase.js";
import { GetStudentCertificatesUseCase } from "../use-cases/GetStudentCertificatesUseCase.js";
import { GetMyCertificatesUseCase } from "../use-cases/GetMyCertificatesUseCase.js";

const certificateRepository = new CertificateRepository();

const studentRepository = new StudentRepository();

const eventRepository = new EventRepository();

const activityRepository = new ActivityRepository();

export const certificateContainer = {

    issueCertificate:

        new IssueCertificateUseCase(

            certificateRepository,

            studentRepository,

            eventRepository,

            activityRepository

        ),

    getCertificate:

        new GetCertificateUseCase(

            certificateRepository,

            studentRepository

        ),

    getStudentCertificates:

        new GetStudentCertificatesUseCase(

            certificateRepository,

            studentRepository

        ),

    getMyCertificates:

        new GetMyCertificatesUseCase(

            certificateRepository,

            studentRepository

        )

};
