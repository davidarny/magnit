import { ICourier, IResponse } from "services/api";
import _ from "lodash";
import { traverse } from "@magnit/template-editor";
import { toSnakeCase } from "services/string";

export async function updateTemplate(courier: ICourier, id: number, template: object) {
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
    return courier.put<IResponse>(`templates/${id}`, { template: buffer });
}
