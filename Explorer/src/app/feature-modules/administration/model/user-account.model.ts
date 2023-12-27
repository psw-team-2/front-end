import { TourPreference } from "../../tour-preference/model/tour-preference.model";

export interface User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    email: string;
    tourPreference: TourPreference;
    token: string
}

export enum UserRole
{
    Administrator,
    Author,
    Tourist
}