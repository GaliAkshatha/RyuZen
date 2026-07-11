export interface AuthResponseDto {

    accessToken: string;

    refreshToken: string;

    user: {

        id: string;

        organizationId: string;

        name: string;

        email: string;

        role: string;

    };

}