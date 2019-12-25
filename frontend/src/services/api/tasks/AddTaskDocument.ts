import { ICourier, IResponse } from "services/api";

export interface IAddTaskDocumentResponse extends IResponse {}

export function addTaskDocument(courier: ICourier, id: number, document: File) {
    const form = new FormData();
    form.append(document.name, document);
    return courier.post<IAddTaskDocumentResponse>(`tasks/${id}/documents`, form);
}
