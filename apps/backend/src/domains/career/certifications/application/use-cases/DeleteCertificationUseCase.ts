import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteCertificationUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

        const certification =

            await this.repository.findById(
                id
            );

        if (!certification) {

            throw new ApiError(

                "Certification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (certification.userId !== userId) {

            throw new ApiError(

                "You can only delete your own certifications.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            id

        );

    }

}
