export interface user {
    name: string,
    email: string,
    image: string,
    id: string,
}
export interface message {
    id: string,
    senderId: string,
    // receiverId: string,
    text: string,
    timestamp: number,
}
export interface chat {
    id: string,
    messages: Array<Message>,
}

export interface  friendRequest{
    id:string,
    senderId:string,
    receiverId:string
}