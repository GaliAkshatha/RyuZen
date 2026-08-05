import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { GetAiProviderStatusUseCase } from "../../application/use-cases/GetAiProviderStatusUseCase.js";

const getAiProviderStatusUseCase = new GetAiProviderStatusUseCase();

export class AiProviderStatusController {

    async get(

        _req: Request,

        res: Response

    ) {

        const status = getAiProviderStatusUseCase.execute();

        return ApiResponse.success(

            res,

            status,

            "AI provider status fetched successfully."

        );

    }

}
