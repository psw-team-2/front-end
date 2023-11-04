export interface Message {
    id: number;
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