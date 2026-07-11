import { User } from "../../domain/entities/User.js";

export interface ITokenProvider {

    generateAccessToken(
        user: User
    ): Promise<string>;

}