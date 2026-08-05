import { CodingProfile } from "../../domain/entities/CodingProfile.js";

import { CodingProfileModel } from "../persistence/CodingProfileModel.js";
import { CodingProfileMapper } from "../mappers/CodingProfileMapper.js";

import { ICodingProfileRepository } from "./ICodingProfileRepository.js";

export class CodingProfileRepository implements ICodingProfileRepository {

    async create(profile: CodingProfile): Promise<CodingProfile> {

        const document = await CodingProfileModel.create(CodingProfileMapper.toPersistence(profile));

        return CodingProfileMapper.toDomain(document);

    }

    async findById(id: string): Promise<CodingProfile | null> {

        const document = await CodingProfileModel.findById(id);

        return document ? CodingProfileMapper.toDomain(document) : null;

    }

    async findByStudentAndPlatform(

        studentId: string,
        platform: string

    ): Promise<CodingProfile | null> {

        const document = await CodingProfileModel.findOne({ studentId, platform });

        return document ? CodingProfileMapper.toDomain(document) : null;

    }

    async findByStudent(studentId: string): Promise<CodingProfile[]> {

        const documents = await CodingProfileModel.find({ studentId });

        return documents.map(document => CodingProfileMapper.toDomain(document));

    }

    /** Real sync targets - only profiles that passed real handle-existence verification are ever synced. */
    async findAllVerified(): Promise<CodingProfile[]> {

        const documents = await CodingProfileModel.find({ verified: true });

        return documents.map(document => CodingProfileMapper.toDomain(document));

    }

    async save(profile: CodingProfile): Promise<CodingProfile> {

        const document = await CodingProfileModel.findByIdAndUpdate(

            profile.id,
            CodingProfileMapper.toPersistence(profile),
            { new: true, runValidators: true }

        );

        if (!document) {
            throw new Error("Coding profile not found.");
        }

        return CodingProfileMapper.toDomain(document);

    }

}
