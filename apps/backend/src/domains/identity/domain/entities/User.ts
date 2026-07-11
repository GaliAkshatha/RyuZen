import { IUser } from "../interfaces/IUser.js";
import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export class User {

    constructor(
        private readonly props: IUser
    ) {}

    grantPermission(

        permission: Permission

    ): void {

        if (

            !this.props.permissions.includes(permission)

        ) {

            this.props.permissions.push(permission);

        }

    }

    revokePermission(

        permission: Permission

    ): void {

        this.props.permissions =

            this.props.permissions.filter(

                value => value !== permission

            );

    }

    hasPermission(

        permission: Permission

    ): boolean {

        return this.props.permissions.includes(permission);

    }

    updateProfile(

        values: {

            name?: string;

            profile?: Partial<IUser["profile"]>;

        }

    ): void {

        if (

            values.name !== undefined

        ) {

            this.props.name =

                values.name;

        }

        if (

            values.profile !== undefined

        ) {

            this.props.profile = {

                ...this.props.profile,

                ...values.profile

            };

        }

    }

    get id() {
        return this.props.id;
    }

    get organizationId() {
        return this.props.organizationId;
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get role() {
        return this.props.role;
    }

    get permissions(): ReadonlyArray<Permission> {

        return Object.freeze(

            [...this.props.permissions]

        );

    }

    get status() {
        return this.props.status;
    }

    get profile(): Readonly<IUser["profile"]> {
        return Object.freeze({ ...this.props.profile });
    }

    get auth(): Readonly<IUser["auth"]> {
        return Object.freeze({ ...this.props.auth });
    }

    get passwordReset(): Readonly<IUser["passwordReset"]> {

        return this.props.passwordReset

            ? Object.freeze({ ...this.props.passwordReset })

            : undefined;

    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IUser> {
        return Object.freeze({
            ...this.props,
            permissions: [...this.props.permissions],
            profile: { ...this.props.profile },
            auth: { ...this.props.auth }
        });
    }

}