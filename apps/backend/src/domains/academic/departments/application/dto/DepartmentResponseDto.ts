export interface DepartmentResponseDto {

    id: string;

    organizationId: string;

    name: string;

    code: string;

    description?: string;

    headOfDepartmentId?: string;

    createdAt?: Date;

    updatedAt?: Date;

}
