import { Profile } from "../../administration/model/profile.model";

export interface ClubWithUser {
    id?: number;
    name: string;
    description: string;
    imageUrl: string;
    ownerId: number;
    memberIds: number[];
    memberProfiles: Profile[];
}