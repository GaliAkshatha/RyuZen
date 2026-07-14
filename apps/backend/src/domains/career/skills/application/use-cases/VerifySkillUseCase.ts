import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class VerifySkillUseCase {

    constructor(

        private readonly repository: ISkillRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<SkillResponseDto> {

        const skill =

            await this.repository.findById(
                id
            );

        if (!skill) {

            throw new ApiError(

                "Skill not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const owner =

            await this.userRepository.findById(
                skill.userId
            );

        if (

            !owner ||
            owner.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Skill not found.",

                HttpStatus.NOT_FOUND

            );

        }

        skill.verify();

        const updated =

            await this.repository.save(
                skill
            );

        return SkillResponseMapper.toDto(

            updated

        );

    }

}
