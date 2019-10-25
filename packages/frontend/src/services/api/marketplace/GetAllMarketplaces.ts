import { IMarketplace } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";

export interface IGetAllMarketplaceResponse extends IResponse {
    marketplaces: IMarketplace[];
}

export function getAllMarketplaces(courier: ICourier) {
    return courier.get<IGetAllMarketplaceResponse>("marketplaces");
}
