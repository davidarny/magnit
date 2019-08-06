/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Fab as MaterialFab } from "@material-ui/core";

export const Fab: React.FC<React.ComponentProps<typeof MaterialFab>> = ({ children, ...props }) => {
    return (
        <MaterialFab
            css={({ spacing, colors }) => ({
                color: colors.white,
                background: colors.primary,
                boxShadow: "none",
                ":active": {
                    background: colors.darkPrimary,
                    boxShadow: "none",
                },
                ":hover": {
                    boxShadow: `0 ${spacing(0.5)} ${spacing()} ${colors.shadowBlue}40`,
                    background: colors.primary,
                },
            })}
            {...props}
        >
            {children}
        </MaterialFab>
    );
};
