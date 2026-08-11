import { AuditLogRepository } from "../../infrastructure/repositories/AuditLogRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { CreateAuditLogUseCase } from "../use-cases/CreateAuditLogUseCase.js";
import { GetAuditLogsUseCase } from "../use-cases/GetAuditLogsUseCase.js";
import { GetAuditLogUseCase } from "../use-cases/GetAuditLogUseCase.js";

const auditLogRepository = new AuditLogRepository();

const userRepository = new UserRepository();

export const auditContainer = {

    createAuditLog:

        new CreateAuditLogUseCase(
            auditLogRepository
        ),

    getAuditLogs:

        new GetAuditLogsUseCase(
            auditLogRepository,
            userRepository
        ),

    getAuditLog:

        new GetAuditLogUseCase(
            auditLogRepository,
            userRepository
        )

};
