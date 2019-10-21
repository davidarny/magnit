import { Injectable, UnauthorizedException } from "@nestjs/common";
import ActiveDirectory from "activedirectory2";
import * as _ from "lodash";

@Injectable()
export class LdapService {
    private readonly ad = new ActiveDirectory({
        url: process.env.LDAP_BASE_URL,
        baseDN: process.env.LDAP_BASE_DN,
        username: process.env.LDAP_USERNAME,
        password: process.env.LDAP_PASSWORD,
    });

    constructor() {
        if (
            process.env.NODE_ENV !== "testing" &&
            (!process.env.LDAP_BASE_URL ||
                !process.env.LDAP_BASE_DN ||
                !process.env.LDAP_USERNAME ||
                !process.env.LDAP_PASSWORD)
        ) {
            throw new Error("Malformed LDAP config");
        }
    }

    async authenticate(username: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.ad.authenticate(username, password, (error, authenticated) => {
                if (error) {
                    return reject(error);
                }
                if (!authenticated) {
                    return reject(new UnauthorizedException("Cannot authorize user"));
                }
                resolve(authenticated);
            });
        });
    }

    async findUsers(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ad.findUsers((error, users) => {
                if (error) {
                    return reject(error);
                }
                resolve(users.map(user => _.get(user, "cn")));
            });
        });
    }

    async getGroupMembershipForUser(username: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ad.getGroupMembershipForUser(username, (error, groups) => {
                if (error) {
                    return reject(error);
                }
                return resolve(groups.map(group => _.get(group, "cn")));
            });
        });
    }
}
