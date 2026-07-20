import { CertificationRepository } from "../../infrastructure/repositories/CertificationRepository.js";

import { CreateCertificationUseCase } from "../use-cases/CreateCertificationUseCase.js";
import { GetCertificationUseCase } from "../use-cases/GetCertificationUseCase.js";
import { GetCertificationsByUserUseCase } from "../use-cases/GetCertificationsByUserUseCase.js";
import { UpdateCertificationUseCase } from "../use-cases/UpdateCertificationUseCase.js";
import { DeleteCertificationUseCase } from "../use-cases/DeleteCertificationUseCase.js";

const certificationRepository = new CertificationRepository();

export const certificationContainer = {

    createCertification:

        new CreateCertificationUseCase(
            certificationRepository
        ),

    getCertification:

        new GetCertificationUseCase(
            certificationRepository
        ),

    getCertificationsByUser:

        new GetCertificationsByUserUseCase(
            certificationRepository
        ),

    updateCertification:

        new UpdateCertificationUseCase(
            certificationRepository
        ),

    deleteCertification:

        new DeleteCertificationUseCase(
            certificationRepository
        )

};
