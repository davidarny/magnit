import { ICourier, IResponse } from "../entities";

export function deleteFile(courier: ICourier, filename: string) {
    return courier.delete<IResponse>(`assets/${filename}`);
}
