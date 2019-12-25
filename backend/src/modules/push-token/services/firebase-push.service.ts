import * as admin from "firebase-admin";
import { IPushService } from "../interfaces/push.service.interface";

export class FirebasePushService implements IPushService {
    private readonly config = require("../../../../firebaseconfig.js");
    private readonly admin = require("firebase-admin");

    constructor() {
        if (!this.config || !this.config.account) {
            throw new Error(`Cannot initialize ${FirebasePushService.name} without account config`);
        }
        this.admin.initializeApp({ credential: admin.credential.cert(this.config.account) });
    }

    async sendToDevice(deviceId: string, message: string, options: object): Promise<void> {
        await admin
            .messaging()
            .sendToDevice(deviceId, { notification: { body: message } }, options);
    }
}
