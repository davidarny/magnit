import { SelectProps } from "@material-ui/core/Select";
import { ETerminals } from "../../entities";
import { jsx } from "@emotion/core";
import { FormControl, Input, InputLabel, Select } from "@material-ui/core";

export interface ISelectField {
    children: unknown;
}

export const SelectField: React.FC<ISelectField & SelectProps> = ({
    children,
    fullWidth,
    value,
    id,
    onChange,
}) => {
    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel htmlFor={id}>Выберите вопрос</InputLabel>
            <Select value={value || ETerminals.EMPTY} input={<Input id={id} />} onChange={onChange}>
                {children}
            </Select>
        </FormControl>
    );
};
