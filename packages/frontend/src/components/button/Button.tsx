/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Button as MaterialButton } from "@material-ui/core";

interface IButtonProps {
    component?: React.ReactNode;
    to?: string;
}

export const Button: React.FC<IButtonProps> = ({ children, ...props }) => {
    return (
        <MaterialButton
            {...props}
            variant="contained"
            css={theme => ({
                background: theme.colors.primary,
                ":hover": { background: theme.colors.primary },
                color: "white",
                textTransform: "none",
                borderRadius: theme.radius(5),
            })}
        >
            {children}
        </MaterialButton>
    );
};
