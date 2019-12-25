import { ICourier, IResponse } from "services/api";

export interface IDeleteTaskDocumentResponse extends IResponse {}

export function deleteTaskDocument(courier: ICourier, taskId: number, documentId: number) {
    return courier.delete<IDeleteTaskDocumentResponse>(`tasks/${taskId}/documents/${documentId}`);
}
