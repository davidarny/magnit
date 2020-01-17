import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import ActiveDirectory from "activedirectory2";
import * as _ from "lodash";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { LoggerFactory } from "../../../shared/providers/logger.factory";

@Injectable()
export class LdapService {
    private readonly logger = new Logger(LdapService.name);
    private readonly ad: ActiveDirectory;

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
        const props = {
            url: process.env.LDAP_BASE_URL,
            baseDN: process.env.LDAP_BASE_DN,
            username: process.env.LDAP_USERNAME,
            password: process.env.LDAP_PASSWORD,
        };
        _.set(props, "logging", LoggerFactory.getLogger());
        this.ad = new ActiveDirectory(props);
    }

    async authenticate(username: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const postfix = process.env.LDAP_USER_POSTFIX ?? "";
            this.ad.authenticate(username + postfix, password, (error, authenticated) => {
                if (error) {
                    this.logger.error(error);
                    return reject(new UserUnauthorizedException("User unauthorized"));
                }
                resolve(authenticated);
            });
        });
    }

    async findUsers(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ad.findUsers((error, users) => {
                if (error) {
                    this.logger.error(error);
                    return reject(new InternalServerErrorException("Cannot fetch users"));
                }
                resolve(users.map(user => _.get(user, "cn")));
            });
        });
    }

    async getGroupMembershipForUser(username: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ad.getGroupMembershipForUser(username, (error, groups) => {
                if (error) {
                    this.logger.error(error);
                    return reject(
                        new InternalServerErrorException("Cannot fetch membership for user"),
                    );
                }
                return resolve(groups.map(group => _.get(group, "cn")));
            });
        });
    }
}
