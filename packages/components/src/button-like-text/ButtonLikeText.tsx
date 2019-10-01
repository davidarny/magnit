/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Typography } from "@material-ui/core";
import { Link } from "@reach/router";
import * as React from "react";

interface IButtonLikeTextProps {
    component?: React.ReactNode;

    onClick?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

type TButtonLikeTextProps = IButtonLikeTextProps &
    React.ComponentProps<typeof Typography> &
    React.ComponentProps<typeof Link>;

export const ButtonLikeText: React.FC<TButtonLikeTextProps> = ({ children, ...props }) => {
    return (
        <Typography
            component={props.component || "span"}
            css={theme => ({
                userSelect: "none",
                display: "inline-block",
                color: theme.colors.primary,
                fontSize: theme.fontSize.sNormal,
                cursor: "pointer",
                boxSizing: "content-box",
                textDecoration: "none",
                ":hover:after": { visibility: "visible" },
                ":after": {
                    display: "block",
                    content: '""',
                    borderBottom: `1px solid ${theme.colors.primary}`,
                    visibility: "hidden",
                },
            })}
            onClick={props.onClick}
            {...props}
        >
            {children}
        </Typography>
    );
};
