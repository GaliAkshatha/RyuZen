import { AuthenticatedUser } from "../../domains/identity/domain/types/Authentication.js";

declare global {

    namespace Express {

        interface Request {

            user?: AuthenticatedUser;

        }

    }

}

export {};