import { FC } from "react";
import { FormControl, Input, InputAdornment, InputLabel } from "@material-ui/core";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";
import { jsx } from "@emotion/core";
import uuid from "uuid/v4";
import * as React from "react";

interface IDateFieldProps {
    label?: string;
}

export const DateField: FC<IDateFieldProps & React.ComponentProps<typeof Input>> = ({
    label,
    disabled = false,
    id = uuid(),
    ...rest
}) => {
    return (
        <FormControl disabled={disabled}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Input
                {...rest}
                id={id}
                type="text"
                disabled={disabled}
                endAdornment={
                    <InputAdornment position="end">
                        <CalendarIcon />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};
