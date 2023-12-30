import { TourPreference } from "../../tour-preference/model/tour-preference.model";
import { Follow } from "./follow.model";

export interface Profile {
    id?: number;
    firstName: string;
    lastName: string;
    profilePicture: string;
    biography: string;
    motto: string;
    userId?: number;
    isActive: boolean;
    follows: Follow[];
    tourPreference: TourPreference;
    questionnaireDone: boolean;
    xp:number;
    isFirstPurchased:boolean;
    numberOfCompletedTours: number;
    requestSent: boolean;
}