export interface ClubRequestWithUser {
    id?: number,
    clubId?: number,
    accountId: number,
    requestStatus: number,
    requestType: number,
    account: import("src/app/infrastructure/auth/model/user.model").User;
}