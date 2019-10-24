import { IAuthObserver } from "./IAuthObserver";

export interface IAuthObservable {
    doOnTokenExpired(onTokenExpire: (observer: IAuthObserver) => Promise<void>): void;
}
