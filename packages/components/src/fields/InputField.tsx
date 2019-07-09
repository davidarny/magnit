/** @jsx jsx */

import * as React from "react";
import { TextField } from "@material-ui/core";
import { jsx } from "@emotion/core";

export interface IInputField {
    isSimpleMode?: boolean;
    css?: object;
}

export const InputField: React.FC<IInputField & React.ComponentProps<typeof TextField>> = props => {
    const { fullWidth, placeholder, defaultValue, isSimpleMode, css, ...rest } = props;
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={placeholder}
            defaultValue={defaultValue}
            css={theme => ({
                height: theme.spacing(6),
                input: {
                    position: "absolute",
                    bottom: 0,
                    color: theme.colors.black,
                },
                div: {
                    height: theme.spacing(6),
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
                ...(css ? css : {})
            })}
            {...rest}
        />
    );
};
