export interface PaymentNotification {
    id?: number,
    administratorId: number,
    userId: number;
    adventureCoin: number;
    status: NotificationStatus
}

export enum NotificationStatus {
    Unread = 0,
    Read = 1,
}