export interface IMailMessage {
    email?: string;
    buffer?: {
        type?: "Buffer";
        data?: number[];
    };
    filename?: string;
    subject?: string;
}
