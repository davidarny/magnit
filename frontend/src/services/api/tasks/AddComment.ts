import { ICourier, IResponse } from "services/api";

export interface IAddCommentResponse extends IResponse {}

export async function addComment(
    courier: ICourier,
    taskId: number,
    templateId: number,
    text: string,
) {
    const path = `tasks/${taskId}/templates/${templateId}/comments`;
    return courier.post<IAddCommentResponse>(path, { text });
}
