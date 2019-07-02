import * as React from "react";
import { jsx, css } from "@emotion/core";
import { FormControl, Input, Select } from "@material-ui/core";

export const SelectField: React.FC<React.ComponentProps<typeof Select>> = ({
    children,
    fullWidth,
    value,
    id,
    onChange,
    placeholder = "",
    ...rest
}) => {
    return (
        <FormControl
            fullWidth={fullWidth}
            css={theme => ({
                minHeight: theme.spacing(6),
                height: "100%",
                borderRadius: theme.radius(5),
                border: "1px solid #DEE5EF",
                transition: "0.25s",
                ":hover, :active": {
                    border: `1px solid ${theme.colors.blue}`,
                },
                input: {
                    fontFamily: "Roboto, sans-serif",
                    color: theme.colors.black,
                    borderRadius: theme.radius(5),
                    height: "100%",
                },
                div: {
                    zIndex: 1,
                    background: `${theme.colors.white} !important`,
                    minHeight: 36,
                    borderRadius: theme.radius(5),
                    overflow: "hidden",
                    ":before, :after": {
                        borderBottom: "none !important",
                    },
                    div: {
                        fontFamily: "Roboto, sans-serif",
                        color: theme.colors.black,
                        height: "100%",
                        div: {
                            padding: "6px 30px",
                            lineHeight: "36px",
                        },
                    },
                    svg: {
                        top: 12,
                        right: 10,
                    },
                },
            })}
        >
            <div
                css={css`
                    position: absolute;
                    top: 15px;
                    left: 25px;
                    border-radius: 0 !important;
                    z-index: 2 !important;
                    height: 24px;
                    min-height: 20px !important;
                    color: #aab4be;
                    display: ${!!value ? "none" : "block"};
                `}
            >
                {placeholder}
            </div>
            <Select value={value} input={<Input id={id} />} onChange={onChange} {...rest}>
                {children}
            </Select>
        </FormControl>
    );
};
