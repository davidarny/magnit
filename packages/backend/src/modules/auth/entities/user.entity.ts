export interface IPublicUser {
    name: string;
}

export class User implements IPublicUser {
    name: string;
    password: string;
}
