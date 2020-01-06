export interface IPushService {
    sendToDevice(deviceId: string, message: string, options: object): Promise<void>;
}
