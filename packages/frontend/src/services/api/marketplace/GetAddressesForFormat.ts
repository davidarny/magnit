import { ICourier, IResponse } from "services/api";

export interface IGetAddressesForFormatResponse extends IResponse {
    addresses: string[];
}

export function getAddressesForFormat(
    courier: ICourier,
    region: string,
    city: string,
    format: string,
) {
    return courier.get<IGetAddressesForFormatResponse>(
        `marketplaces/regions/${region}/cities/${city}/formats/${format}`,
    );
}
