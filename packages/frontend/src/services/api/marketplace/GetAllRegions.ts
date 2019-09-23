import { ICourier, IResponse } from "services/api";

export interface IGetAllRegionsResponse extends IResponse {
    regions: string[];
}

export function getAllRegions(courier: ICourier) {
    return courier.get<IGetAllRegionsResponse>("marketplaces/regions");
}
