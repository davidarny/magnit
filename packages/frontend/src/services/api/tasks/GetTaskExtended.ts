import { ITemplate } from "@magnit/template-editor";
import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "@magnit/services";

interface IEditableTemplate extends ITemplate {
    editable: boolean;
}

export interface IGetTaskExtendedResponse extends IResponse {
    task: {
        id: number;
        name: string;
        status: ETaskStatus;
        descriptions: string;
        templates: IEditableTemplate[];
        updatedAt: string;
        createdAt: string;
    };
}

export async function getTaskExtended(courier: ICourier, id: number) {
    return courier.get<IGetTaskExtendedResponse>(`tasks/${id}/extended`);
}
