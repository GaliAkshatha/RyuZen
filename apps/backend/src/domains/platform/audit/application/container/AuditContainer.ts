import { AuditLogRepository } from "../../infrastructure/repositories/AuditLogRepository.js";

import { CreateAuditLogUseCase } from "../use-cases/CreateAuditLogUseCase.js";
import { GetAuditLogUseCase } from "../use-cases/GetAuditLogUseCase.js";
import { GetAuditLogsUseCase } from "../use-cases/GetAuditLogsUseCase.js";

const auditLogRepository = new AuditLogRepository();

export const auditContainer = {

    createAuditLog:

        new CreateAuditLogUseCase(
            auditLogRepository
        ),

    getAuditLogs:

        new GetAuditLogsUseCase(
            auditLogRepository
        ),

    getAuditLog:

        new GetAuditLogUseCase(
            auditLogRepository
        )

};