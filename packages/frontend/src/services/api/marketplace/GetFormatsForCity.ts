import { ICourier, IResponse } from "services/api";

export interface IGetFormatsForCityResponse extends IResponse {
    formats: string[];
}

export function getFormatsForCity(courier: ICourier, region: string, city: string) {
    return courier.get<IGetFormatsForCityResponse>(
        `marketplaces/regions/${region}/cities/${city}/formats`,
    );
}
