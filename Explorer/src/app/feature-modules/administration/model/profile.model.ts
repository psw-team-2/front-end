export interface Profile {
    id?: number;
    firstName: string;
    lastName: string;
    profilePicture: string;
    biography: string;
    motto: string;
    userId?: number;
    isActive: boolean;
}