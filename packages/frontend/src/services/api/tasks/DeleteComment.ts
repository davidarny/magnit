import { ICourier, IResponse } from "services/api";

export interface IDeleteCommentResponse extends IResponse {}

export async function deleteComment(courier: ICourier, taskId: number, commentId: number) {
    const path = `tasks/${taskId}/comments/${commentId}`;
    return courier.delete<IDeleteCommentResponse>(path);
}
