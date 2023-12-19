export interface Request {
    id: number;
    profileId?: number;
    status: RequestStatus
}

export enum RequestStatus
{
    UnderReview,
    Approved,
    Declined
}