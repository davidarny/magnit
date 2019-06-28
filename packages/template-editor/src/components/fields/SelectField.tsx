import { SelectProps } from "@material-ui/core/Select";
import { ETerminals } from "../../entities";
import { jsx } from "@emotion/core";
import { FormControl, Input, InputLabel, Select } from "@material-ui/core";

export const SelectField: React.FC<SelectProps> = ({
    children,
    fullWidth,
    value,
    id,
    onChange,
    ...rest
}) => {
    return (
        <FormControl
            fullWidth={fullWidth}
            css={theme => ({
                minHeight: theme.spacing(6),
                height: "100%",
                input: {
                    fontFamily: "Roboto",
                    color: theme.colors.black,
                },
                div: {
                    minHeight: 20,
                    ":before": {
                        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                    },
                    ":after": {
                        borderBottom: `2px solid ${theme.colors.primary}`,
                    },
                    div: {
                        fontFamily: "Roboto",
                        color: theme.colors.black,
                        paddingTop: 11,
                    },
                    svg: {
                        top: 20,
                    },
                },
            })}
        >
            <Select
                value={value || ETerminals.EMPTY}
                input={<Input id={id} />}
                onChange={onChange}
                {...rest}
            >
                {children}
            </Select>
        </FormControl>
    );
};
