import { ICourier, IResponse } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";
import { toSnakeCase } from "services/string";

interface ICreateTemplateResponse extends IResponse {
    template_id: number;
}

export async function createTemplate(courier: ICourier, template: object) {
    const buffer = _.cloneDeep(template);
    // convert all props to snake_case before saving
    traverse(buffer, (object: any) => {
        if (_.isObject(object)) {
            _.mapKeys(object, (value: any, key: string) => {
                delete (object as { [key: string]: any })[key];
                (object as { [key: string]: any })[toSnakeCase(key)] = value;
            });
        }
    });
    return courier.post<ICreateTemplateResponse>("templates", { template: buffer });
}
