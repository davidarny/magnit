import { ICourier, IResponse } from "../entities";

interface IUploadFileResponse extends IResponse {
    filename: string;
}

export function uploadFile(courier: ICourier, file: File) {
    const data = new FormData();
    data.append("file", file);
    return courier.post<IUploadFileResponse>("assets", data);
}
