/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { FormControl, Input, MenuItem, Select } from "@material-ui/core";

export const SelectField: React.FC<React.ComponentProps<typeof Select>> = props => {
    const { children, placeholder = "", value = "", displayEmpty = true, ...rest } = props;

    return (
        <FormControl
            fullWidth={props.fullWidth}
            css={theme => ({
                height: theme.spacing(6),
                borderRadius: theme.radius(5),
                background: theme.colors.white,
                border: `1px solid ${theme.colors.lightGray}`,
                transition: "border 0.25s ease-in-out",
                cursor: "pointer",
                ":hover, :active": {
                    border: props.disabled
                        ? `1px solid ${theme.colors.lightGray}`
                        : `1px solid ${theme.colors.primary}`,
                },
            })}
        >
            <Select
                {...(placeholder && !value
                    ? {
                          value,
                          displayEmpty,
                          placeholder,
                      }
                    : { value })}
                input={
                    <Input
                        disableUnderline
                        css={theme => ({
                            border: "none",
                            height: "100%",
                            background: "transparent",
                            padding: `0 ${theme.spacing(2.5)}`,
                            cursor: "pointer",
                            color: !value ? theme.colors.gray : "initial",
                            fontWeight: props.value ? 400 : 300,
                            div: {
                                div: {
                                    padding: "10px 0 7px",
                                },
                            },
                        })}
                    />
                }
                css={theme => ({
                    ".select:focus": { background: theme.colors.white },
                    ".icon": {
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: theme.spacing(),
                        opacity: props.disabled ? 0.5 : 1,
                    },
                })}
                classes={{
                    select: "select",
                    icon: "icon",
                    root: "root",
                }}
                {...rest}
            >
                {placeholder && (
                    <MenuItem disabled value="" css={theme => ({
                        color: theme.colors.secondary,
                    })}>
                        {placeholder}
                    </MenuItem>
                )}
                {children}
            </Select>
        </FormControl>
    );
};
