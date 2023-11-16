export interface PublicRequest {
    id?: number,
    entityId: number,
    authorId: number,
    comment: string,
    isCheckPoint: boolean,
    isNotified: boolean,
    isApproved: boolean
}