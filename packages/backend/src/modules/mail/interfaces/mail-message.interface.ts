export interface IMailMessage {
    email?: string;
    buffer?:
        | {
              type?: "Buffer";
              data?: number[];
          }
        | Buffer;
    filename?: string;
    subject?: string;
}
