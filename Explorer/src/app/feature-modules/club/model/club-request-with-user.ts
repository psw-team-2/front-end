export interface ClubRequestWithUser {
    id?: number,
    clubId?: number,
    accountId: number,
    requestStatus: number,
    requestType: number,
    account: import("c:/Users/Tatjana/Desktop/PSW/front-end/Explorer/src/app/infrastructure/auth/model/user.model").User;
}