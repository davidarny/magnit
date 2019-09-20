import { ICourier, IResponse } from "services/api";

export interface IGetCitiesForRegionResponse extends IResponse {
    cities: string[];
}

export function getCitiesForRegion(courier: ICourier, region: string) {
    return courier.get<IGetCitiesForRegionResponse>(`marketplaces/regions/${region}/cities`);
}
