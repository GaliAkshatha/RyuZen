import { ActivityRepository } from "../../infrastructure/repositories/ActivityRepository.js";

import { CreateActivityUseCase } from "../use-cases/CreateActivityUseCase.js";
import { UpdateActivityUseCase } from "../use-cases/UpdateActivityUseCase.js";
import { GetActivityUseCase } from "../use-cases/GetActivitiesUseCase.js";
import { ListActivitiesUseCase } from "../use-cases/ListActivitiesUseCase.js";
import { PublishActivityUseCase } from "../use-cases/PublishActivityUseCase.js";
import { CloseActivityUseCase } from "../use-cases/CloseActivityUseCase.js";
import { DeleteActivityUseCase } from "../use-cases/DeleteActivityUseCase.js";

export class ActivityModule {

    private readonly repository =
        new ActivityRepository();

    readonly createActivity =
        new CreateActivityUseCase(
            this.repository
        );

    readonly updateActivity =
        new UpdateActivityUseCase(
            this.repository
        );

    readonly getActivities =
        new GetActivityUseCase(
            this.repository
        );

    readonly listActivities =
        new ListActivitiesUseCase(
            this.repository
        );

    readonly publishActivity =
        new PublishActivityUseCase(
            this.repository
        );

    readonly closeActivity =
        new CloseActivityUseCase(
            this.repository
        );

    readonly deleteActivity =
        new DeleteActivityUseCase(
            this.repository
        );

}

export const activityModule =
    new ActivityModule();