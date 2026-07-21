import { NextFunction, Request, Response } from "express";

import { auditContainer } from "../../../domains/platform/audit/application/container/AuditContainer.js";

export const auditLogger =

    (

        action: string,

        entityType?: string

    ) =>

    (

        req: Request,

        res: Response,

        next: NextFunction

    ): void => {

        res.on("finish", () => {

            if (!req.user) {

                return;

            }

            auditContainer

                .createAuditLog

                .execute({

                    organizationId: req.user.organizationId,

                    userId: req.user.userId,

                    action,

                    entityType,

                    entityId:

                        typeof req.params?.id === "string"
                            ? req.params.id
                            : undefined,

                    method: req.method,

                    path: req.originalUrl,

                    statusCode: res.statusCode,

                    ipAddress: req.ip,

                    userAgent: req.get("user-agent")

                })

                .catch(() => {

                    // Audit logging must never break the request lifecycle.

                });

        });

        next();

    };
