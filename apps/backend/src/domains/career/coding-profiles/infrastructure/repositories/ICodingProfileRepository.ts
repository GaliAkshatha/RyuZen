import { CodingProfile } from "../../domain/entities/CodingProfile.js";

export interface ICodingProfileRepository {

    create(profile: CodingProfile): Promise<CodingProfile>;

    findById(id: string): Promise<CodingProfile | null>;

    findByStudentAndPlatform(studentId: string, platform: string): Promise<CodingProfile | null>;

    findByStudent(studentId: string): Promise<CodingProfile[]>;

    findAllVerified(): Promise<CodingProfile[]>;

    save(profile: CodingProfile): Promise<CodingProfile>;

}
