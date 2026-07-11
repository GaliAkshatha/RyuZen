import { UserRole } from "../../domain/constants/UserRole.js";

export interface RegisterUserDto {

    organizationCode: string;

    name: string;

    email: string;

    password: string;

}