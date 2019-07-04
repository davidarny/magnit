/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Paper } from "@material-ui/core";

export interface ISelectableBlockWrapperProps {
    focused?: boolean;
    css?: (theme: any) => React.CSSProperties;
}

type TPaperProps = React.ComponentProps<typeof Paper>;
type TSelectableBlockWrapperProps = ISelectableBlockWrapperProps & TPaperProps;

export const SelectableBlockWrapper: React.FC<TSelectableBlockWrapperProps> = props => {
    const { children, focused = false, css = () => {}, ...rest } = props;
    return (
        <Paper
            {...rest}
            css={theme => ({
                boxShadow: focused
                    ? `0px 0px ${theme.spacing(2)} ${theme.colors.shadowGray} !important`
                    : "none",
                overflow: "hidden",
                position: "relative",
                ...css(theme),
            })}
            square={false}
        >
            <div
                css={theme => ({
                    position: "absolute",
                    width: theme.spacing(),
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.primary,
                    zIndex: 1000,
                    display: focused ? "block" : "none",
                })}
            />
            {children}
        </Paper>
    );
};
