/** @jsx jsx */

import { TextField } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import * as React from "react";

export interface IInputField {
    isSimpleMode?: boolean;
}

export const InputField: React.FC<IInputField & TextFieldProps> = ({
    placeholder,
    defaultValue,
    fullWidth,
    isSimpleMode = false,
    ...rest
}) => {
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={placeholder}
            defaultValue={defaultValue}
            css={theme => ({
                minHeight: theme.spacing(6),
                height: "100%",
                input: {
                    position: "absolute",
                    bottom: 0,
                    fontFamily: "Roboto",
                    color: theme.colors.black,
                },
                div: {
                    minHeight: theme.spacing(6),
                    ":before": {
                        borderBottom: isSimpleMode
                            ? "none !important"
                            : "1px solid rgba(0, 0, 0, 0.42)",
                    },
                    ":after": {
                        borderBottom: isSimpleMode
                            ? "none !important"
                            : `2px solid ${theme.colors.primary}`,
                    },
                },
            })}
            {...rest}
        />
    );
};
