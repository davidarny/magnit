/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TextField } from "@material-ui/core";
import * as React from "react";

export interface IInputField {
    simple?: boolean;
    css?: object | ((theme: any) => React.CSSProperties);
}

export const InputField: React.FC<IInputField & React.ComponentProps<typeof TextField>> = props => {
    const { fullWidth, placeholder, defaultValue, simple, multiline = false, ...rest } = props;
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={placeholder}
            defaultValue={defaultValue}
            css={theme => ({
                // handle text-area
                ...(!multiline ? { height: theme.spacing(6) } : { minHeight: theme.spacing(6) }),
                cursor: "pointer",
                input: {
                    boxSizing: "border-box",
                    color: theme.colors.black,
                    height: "100%",
                },
                div: {
                    // handle text-area
                    ...(!multiline
                        ? { height: theme.spacing(6) }
                        : { minHeight: theme.spacing(6) }),
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
            multiline={multiline}
            {...rest}
        />
    );
};

InputField.displayName = "InputField";
