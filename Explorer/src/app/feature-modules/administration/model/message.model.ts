export interface Message {
    senderId: number;
    receiverId: number;
    messageContent: string;
    status: MessageStatus
}

enum MessageStatus
{
    NotRead,
    Read
}