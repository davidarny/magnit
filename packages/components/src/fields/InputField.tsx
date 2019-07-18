/** @jsx jsx */

import * as React from "react";
import { TextField } from "@material-ui/core";
import { jsx } from "@emotion/core";

export interface IInputField {
    simple?: boolean;
    css?: object | ((theme: any) => React.CSSProperties);
}

export const InputField: React.FC<IInputField & React.ComponentProps<typeof TextField>> = props => {
    const { fullWidth, placeholder, defaultValue, simple, ...rest } = props;
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={placeholder}
            defaultValue={defaultValue}
            css={theme => ({
                height: theme.spacing(6),
                cursor: "pointer",
                input: {
                    boxSizing: "border-box",
                    color: theme.colors.black,
                    height: "100%",
                },
                div: {
                    height: theme.spacing(6),
                    ":before": {
                        borderBottom: simple
                            ? "none !important"
                            : `1px solid ${theme.colors.default}42`,
                    },
                    ":after": {
                        borderBottom: simple
                            ? "none !important"
                            : `2px solid ${theme.colors.primary}`,
                    },
                },
            })}
            {...rest}
        />
    );
};
