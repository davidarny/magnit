import { IUser } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";

interface IGetAllUsersResponse extends IResponse {
    users: IUser[];
}

export function getAllUsers(courier: ICourier) {
    return courier.get<IGetAllUsersResponse>("auth/users");
}
