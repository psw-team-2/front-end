export interface PublicRequest {
    id?: number,
    entityId: number,
    authorId: number,
    comment: string,
    isCheckpoint: boolean,
    isNotified: boolean
}