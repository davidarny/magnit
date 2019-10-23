import { IAuthObserver } from "./IAuthObserver";

export interface IAuthObservable {
    doOnTokenExpired(onTokenExpire: (observer: IAuthObserver) => void): void;
}
