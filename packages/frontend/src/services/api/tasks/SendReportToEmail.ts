import { ICourier, IResponse } from "services/api";

export interface ISendReportToEmailResponse extends IResponse {}

export function sendReportToEmail(courier: ICourier, id: number, email: string) {
    return courier.get<ISendReportToEmailResponse>(`tasks/${id}/report/email/${email}`);
}
