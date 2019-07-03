/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { FormControl, Input, MenuItem, Select } from "@material-ui/core";

export const SelectField: React.FC<React.ComponentProps<typeof Select>> = props => {
    const { children, fullWidth, value, id, onChange, placeholder = "", ...rest } = props;
    return (
        <FormControl
            fullWidth={fullWidth}
            css={theme => ({
                height: theme.spacing(6),
                borderRadius: theme.radius(5),
                background: theme.colors.white,
                border: `1px solid ${theme.colors.lightGray}`,
                transition: "border 0.25s ease-in-out",
                ":hover, :active": {
                    border: `1px solid ${theme.colors.primary}`,
                },
            })}
        >
            <Select
                value={value}
                displayEmpty
                input={
                    <Input
                        css={theme => ({
                            border: "none",
                            height: "100%",
                            ":before, :after": { display: "none" },
                            background: "transparent",
                            padding: `0 ${theme.spacing(2)}`,
                        })}
                        id={id}
                    />
                }
                onChange={onChange}
                css={theme => ({
                    ".select:focus": { background: theme.colors.white },
                    ".icon": {
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: theme.spacing(),
                    },
                })}
                classes={{ select: "select", icon: "icon", root: "root" }}
                {...rest}
            >
                <MenuItem disabled value="" css={theme => ({ color: theme.colors.secondary })}>
                    {placeholder}
                </MenuItem>
                {children}
            </Select>
        </FormControl>
    );
};
