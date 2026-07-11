import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

export class DeleteActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string

    ): Promise<void> {

        await this.repository.delete(id);

    }

}