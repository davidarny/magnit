import { IResponse, ICourier } from "services/api";
import _ from "lodash";
import { traverse } from "@magnit/template-editor";
import { toCamelCase } from "services/string";

interface IGetTemplate extends IResponse {
    template: string;
}

export async function getTemplate(courier: ICourier, id: number) {
    const response = await courier.get<IGetTemplate>(`templates/${id}`);
    const buffer = JSON.parse(response.template);
    // convert all props to snake_case before saving
    traverse(buffer, (object: any) => {
        if (_.isObject(object)) {
            _.mapKeys(object, (value: any, key: string) => {
                delete (object as { [key: string]: any })[key];
                (object as { [key: string]: any })[toCamelCase(key)] = value;
            });
        }
    });
    console.log("%c%s", "color:" + "#006DFF", "template", buffer);
    response.template = JSON.stringify(buffer);
    return response;
}
