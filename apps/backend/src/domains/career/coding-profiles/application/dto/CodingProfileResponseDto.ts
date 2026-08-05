import { CodingPlatform } from "../../domain/constants/CodingPlatform.js";

export interface CodingProfileResponseDto {

    id: string;

    platform: CodingPlatform;

    handle: string;

    verified: boolean;

    currentRating?: number;

    maxRating?: number;

    rank?: string;

    problemsSolved?: number;

    lastSyncedAt?: Date;

}
