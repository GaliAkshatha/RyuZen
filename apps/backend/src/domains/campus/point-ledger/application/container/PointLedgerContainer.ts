import { PointLedgerRepository } from "../../infrastructure/repositories/PointLedgerRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { RecordPointTransactionUseCase } from "../use-cases/RecordPointTransactionUseCase.js";
import { GetStudentPointHistoryUseCase } from "../use-cases/GetStudentPointHistoryUseCase.js";
import { GetMyPointHistoryUseCase } from "../use-cases/GetMyPointHistoryUseCase.js";
import { GetPointLedgerAuditUseCase } from "../use-cases/GetPointLedgerAuditUseCase.js";

const pointLedgerRepository = new PointLedgerRepository();

const studentRepository = new StudentRepository();

export const pointLedgerContainer = {

    recordPointTransaction:

        new RecordPointTransactionUseCase(
            pointLedgerRepository
        ),

    getStudentPointHistory:

        new GetStudentPointHistoryUseCase(
            pointLedgerRepository
        ),

    getMyPointHistory:

        new GetMyPointHistoryUseCase(
            pointLedgerRepository,
            studentRepository
        ),

    getPointLedgerAudit:

        new GetPointLedgerAuditUseCase(
            pointLedgerRepository
        )

};
