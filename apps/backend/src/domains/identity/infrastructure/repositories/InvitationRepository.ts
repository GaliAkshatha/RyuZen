import { Invitation } from "../../domain/entities/Invitation.js";

import { InvitationModel } from "../persistence/InvitationModel.js";

import { InvitationMapper } from "../mappers/InvitationMapper.js";

import { IInvitationRepository } from "./IInvitationRepository.js";

import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

export class InvitationRepository
implements IInvitationRepository {

    async create(

        invitation: Invitation

    ): Promise<Invitation> {

        const document =
            await InvitationModel.create(

                InvitationMapper.toPersistence(
                    invitation
                )

            );

        return InvitationMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<Invitation | null> {

        const document =
            await InvitationModel.findById(id);

        return document
            ? InvitationMapper.toDomain(document)
            : null;

    }

    async findPendingByEmail(

        email: string

    ): Promise<Invitation | null> {

        const document =
            await InvitationModel
                .findOne({
                    email: email.toLowerCase(),
                    status: InvitationStatus.PENDING
                })
                .sort({ createdAt: -1 });

        return document
            ? InvitationMapper.toDomain(document)
            : null;

    }

    async findByOrganization(

        organizationId: string

    ): Promise<Invitation[]> {

        const documents =
            await InvitationModel
                .find({ organizationId })
                .sort({ createdAt: -1 });

        return documents.map(
            document => InvitationMapper.toDomain(document)
        );

    }

    async findByUserId(

        userId: string

    ): Promise<Invitation | null> {

        const document =
            await InvitationModel
                .findOne({ userId })
                .sort({ createdAt: -1 });

        return document
            ? InvitationMapper.toDomain(document)
            : null;

    }

    async save(

        invitation: Invitation

    ): Promise<Invitation> {

        const document =
            await InvitationModel.findByIdAndUpdate(

                invitation.id,

                InvitationMapper.toPersistence(
                    invitation
                ),

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!document) {

            throw new Error(
                "Invitation not found."
            );

        }

        return InvitationMapper.toDomain(
            document
        );

    }

}
