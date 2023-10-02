export type Chat = {
    id: string;
    messages: Message[];
};

export type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: number;
};
