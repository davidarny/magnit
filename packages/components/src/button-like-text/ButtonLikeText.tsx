/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Typography } from "@material-ui/core";
import { LinkProps } from "@reach/router";
import * as React from "react";

interface IButtonLikeTextProps {
    // TODO: infer type
    component?: any;

    onClick?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

type TButtonLikeTextProps = Omit<React.ComponentProps<typeof Typography>, "component"> &
    Partial<LinkProps<{}>> &
    IButtonLikeTextProps;

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
