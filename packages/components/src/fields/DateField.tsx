/** @jsx jsx */

import { jsx } from "@emotion/core";
import { CalendarIcon } from "@magnit/icons";
import { FormControl, Input, InputAdornment, InputLabel } from "@material-ui/core";
import * as React from "react";
import uuid from "uuid/v4";

interface IDateFieldProps {
    label?: string;
}

type TDateFieldProps = IDateFieldProps & React.ComponentProps<typeof Input>;

export const DateField: React.FC<TDateFieldProps> = props => {
    const { label, disabled = false, id = uuid(), ...rest } = props;

    return (
        <FormControl disabled={disabled}>
            {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
            <Input
                id={id}
                type="text"
                disabled={disabled}
                endAdornment={
                    <InputAdornment position="end">
                        <CalendarIcon
                            color="#8A94A2"
                            css={theme => ({ color: theme.colors.secondary })}
                        />
                    </InputAdornment>
                }
                css={theme => ({
                    ":before": { borderBottom: `1px solid ${theme.colors.default}42` },
                    ":after": { borderBottom: `2px solid ${theme.colors.primary}` },
                })}
                {...rest}
            />
        </FormControl>
    );
};
