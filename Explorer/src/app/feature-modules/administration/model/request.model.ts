export interface Request {
    id: number;
    profileId?: number;
    status: RequestStatus
}

enum RequestStatus
{
    UnderReview,
    Approved,
    Declined
}