import { ICompanyRepository } from "../../infrastructure/repositories/ICompanyRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteCompanyUseCase {

    constructor(

        private readonly repository: ICompanyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<void> {

        const company =

            await this.repository.findById(
                id
            );

        if (

            !company ||
            company.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Company not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.repository.delete(

            id

        );

    }

}
