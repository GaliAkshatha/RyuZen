import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { assessmentContainer } from "../../application/container/AssessmentContainer.js";

function requireParam(value: string | undefined, name: string): string {

    if (!value || Array.isArray(value)) {

        throw new ApiError(`Invalid ${name}.`, HttpStatus.BAD_REQUEST);

    }

    return value;

}

export class AssessmentController {

    async create(req: Request, res: Response) {

        const assessment = await assessmentContainer.createAssessment.execute(

            req.user!.organizationId,
            req.user!.userId,
            req.body

        );

        return ApiResponse.success(res, assessment, "Assessment created successfully.", 201);

    }

    async addQuestion(req: Request, res: Response) {

        const id = requireParam(req.params.id, "assessment id");

        const order = req.body.order ?? 0;

        const question = await assessmentContainer.addQuestion.execute(

            id,
            req.user!.organizationId,
            req.body,
            order

        );

        return ApiResponse.success(res, question, "Question added successfully.", 201);

    }

    async publish(req: Request, res: Response) {

        const id = requireParam(req.params.id, "assessment id");

        const assessment = await assessmentContainer.publishAssessment.execute(

            id,
            req.user!.organizationId

        );

        return ApiResponse.success(res, assessment, "Assessment published successfully.");

    }

    async startAttempt(req: Request, res: Response) {

        const id = requireParam(req.params.id, "assessment id");

        const attempt = await assessmentContainer.startAttempt.execute(

            id,
            req.user!.organizationId,
            req.user!.userId

        );

        return ApiResponse.success(res, attempt, "Attempt started successfully.", 201);

    }

    async recordAnswer(req: Request, res: Response) {

        const id = requireParam(req.params.id, "attempt id");

        const attempt = await assessmentContainer.recordAnswer.execute(

            id,
            req.user!.userId,
            req.body

        );

        return ApiResponse.success(res, attempt, "Answer recorded successfully.");

    }

    async submitAttempt(req: Request, res: Response) {

        const id = requireParam(req.params.id, "attempt id");

        const attempt = await assessmentContainer.submitAttempt.execute(

            id,
            req.user!.userId

        );

        return ApiResponse.success(res, attempt, "Attempt submitted successfully.");

    }

    async getQuestionsForAttempt(req: Request, res: Response) {

        const id = requireParam(req.params.id, "assessment id");

        const questions = await assessmentContainer.getQuestionsForAttempt.execute(id);

        return ApiResponse.success(res, questions, "Questions fetched successfully.");

    }

    async list(req: Request, res: Response) {

        const assessments = await assessmentContainer.getOrganizationAssessments.execute(

            req.user!.organizationId

        );

        return ApiResponse.success(res, assessments, "Assessments fetched successfully.");

    }

    async getResults(req: Request, res: Response) {

        const id = requireParam(req.params.id, "assessment id");

        const results = await assessmentContainer.getAssessmentResults.execute(

            id,
            req.user!.organizationId

        );

        return ApiResponse.success(res, results, "Results fetched successfully.");

    }

    async getMyAttempts(req: Request, res: Response) {

        const attempts = await assessmentContainer.getMyAttempts.execute(req.user!.userId);

        return ApiResponse.success(res, attempts, "Your attempts fetched successfully.");

    }

}
