import { ConnectionRequestRepository } from "../../infrastructure/repositories/ConnectionRequestRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { GetConnectableUsersUseCase } from "../use-cases/GetConnectableUsersUseCase.js";
import { SendConnectionRequestUseCase } from "../use-cases/SendConnectionRequestUseCase.js";
import { RespondToConnectionRequestUseCase } from "../use-cases/RespondToConnectionRequestUseCase.js";
import { GetPendingConnectionRequestsUseCase } from "../use-cases/GetPendingConnectionRequestsUseCase.js";
import { GetMyConnectionsUseCase } from "../use-cases/GetMyConnectionsUseCase.js";

import { notificationContainer } from "../../../../communication/notifications/application/container/NotificationContainer.js";

const connectionRequestRepository = new ConnectionRequestRepository();

const userRepository = new UserRepository();

export const connectionContainer = {

    getConnectableUsers:

        new GetConnectableUsersUseCase(

            userRepository,

            connectionRequestRepository

        ),

    sendRequest:

        new SendConnectionRequestUseCase(

            connectionRequestRepository,

            userRepository,

            notificationContainer.recordSystemNotification

        ),

    respondToRequest:

        new RespondToConnectionRequestUseCase(

            connectionRequestRepository,

            userRepository,

            notificationContainer.recordSystemNotification

        ),

    getPendingRequests:

        new GetPendingConnectionRequestsUseCase(

            connectionRequestRepository,

            userRepository

        ),

    getMyConnections:

        new GetMyConnectionsUseCase(

            connectionRequestRepository,

            userRepository

        )

};
