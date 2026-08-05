import { ConnectionRequest } from "../../domain/entities/ConnectionRequest.js";

import { ConnectionRequestModel } from "../persistence/ConnectionRequestModel.js";
import { ConnectionRequestMapper } from "../mappers/ConnectionRequestMapper.js";

import { IConnectionRequestRepository } from "./IConnectionRequestRepository.js";

export class ConnectionRequestRepository implements IConnectionRequestRepository {

    async create(request: ConnectionRequest): Promise<ConnectionRequest> {

        const document = await ConnectionRequestModel.create(
            ConnectionRequestMapper.toPersistence(request)
        );

        return ConnectionRequestMapper.toDomain(document);

    }

    async findById(id: string): Promise<ConnectionRequest | null> {

        const document = await ConnectionRequestModel.findById(id);

        return document ? ConnectionRequestMapper.toDomain(document) : null;

    }

    async findBetween(userIdA: string, userIdB: string): Promise<ConnectionRequest | null> {

        const document = await ConnectionRequestModel.findOne({

            $or: [
                { fromUserId: userIdA, toUserId: userIdB },
                { fromUserId: userIdB, toUserId: userIdA },
            ],

        }).sort({ createdAt: -1 });

        return document ? ConnectionRequestMapper.toDomain(document) : null;

    }

    async findPendingForUser(userId: string): Promise<ConnectionRequest[]> {

        const documents = await ConnectionRequestModel
            .find({ toUserId: userId, status: "PENDING" })
            .sort({ createdAt: -1 });

        return documents.map(document => ConnectionRequestMapper.toDomain(document));

    }

    async findAcceptedForUser(userId: string): Promise<ConnectionRequest[]> {

        const documents = await ConnectionRequestModel.find({

            status: "ACCEPTED",
            $or: [{ fromUserId: userId }, { toUserId: userId }],

        });

        return documents.map(document => ConnectionRequestMapper.toDomain(document));

    }

    async save(request: ConnectionRequest): Promise<ConnectionRequest> {

        const document = await ConnectionRequestModel.findByIdAndUpdate(

            request.id,
            ConnectionRequestMapper.toPersistence(request),
            { new: true, runValidators: true }

        );

        if (!document) {
            throw new Error("Connection request not found.");
        }

        return ConnectionRequestMapper.toDomain(document);

    }

}
