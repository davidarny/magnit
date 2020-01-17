export namespace AirwatchAPI {
    export interface IDeviceUser {
        Id: number;
        Uuid: string;
        UserName: string;
        FirstName: string;
        LastName: string;
        Status: boolean;
        Email: string;
        SecurityType: string;
        ContactNumber: string;
        Group: string;
        Role: string;
        MessageType: string;
        EmailUserName: string;
        EnrolledDevicesCount: string;
        LocationGroupId: string;
        ExternalId: string;
    }

    export namespace System {
        export namespace Users {
            export namespace Search {
                interface IResponse {
                    Users: IDeviceUser;
                }
            }
        }
    }

    export namespace MDM {
        export namespace Devices {
            export interface IDevice {
                Id: {
                    Value: number;
                };
                Uuid: string;
                SerialNumber: string;
                MacAddress: string;
                Imei: string;
                EasId: string;
                AssetNumber: string;
                DeviceFriendlyName: string;
                LocationGroupId: string;
                LocationGroupName: string;
                UserId: string;
                UserName: string;
                UserEmailAddress: string;
                Ownership: string;
                PlatformId: string;
                Platform: string;
                ModelId: string;
                Model: string;
                PhoneNumber: string;
                OperatingSystem: string;
                LastSeen: string; // DateTime
                EnrollmentStatus: string;
                ComplianceStatus: boolean;
                CompromisedStatus: string;
                LastEnrolledOn: string; // DateTime
                LastComplianceCheckOn: string; // DateTime
                LastCompromisedCheckOn: string; // DateTime
                ComplianceSummary: Array<{
                    Id: number;
                    CompliantStatus: boolean;
                    PolicyName: string;
                    PolicyDetail: string;
                    LastComplianceCheck: string; // DateTime
                    NextComplianceCheck: string; // DateTime
                    ActionTaken: Array<{
                        ActionType: string;
                    }>;
                }>;
                IsSupervised: boolean;
            }

            export namespace User {
                export interface IResponse {
                    DeviceUser: IDeviceUser;
                }
            }

            export namespace Search {
                export interface IResponse {
                    Page: number;
                    PageSize: number;
                    Total: number;
                    Devices: IDevice[];
                }
            }
        }
    }
}
