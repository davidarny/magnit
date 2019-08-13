/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Paper } from "@material-ui/core";

export interface ISelectableBlockWrapperProps {
    focused?: boolean;
}

type TSelectableBlockWrapperProps = ISelectableBlockWrapperProps &
    React.ComponentProps<typeof Paper>;

export const SelectableBlockWrapper: React.FC<TSelectableBlockWrapperProps> = props => {
    const { children, focused = false, ...rest } = props;
    return (
        <Paper
            square
            css={({ spacing, colors }) => ({
                boxShadow: focused ? `0 0 ${spacing(2)} ${colors.shadowGray}` : "none",
                position: "relative",
            })}
            {...rest}
        >
            <div
                css={theme => ({
                    position: "absolute",
                    width: theme.spacing(0.5),
                    left: theme.spacing(-0.5),
                    borderRadius: `${theme.radius(0.5)} 0 0 ${theme.radius(0.5)}`,
                    top: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.primary,
                    zIndex: 1000,
                    display: focused ? "block" : "none",
                })}
            />
            {children}
            <div
                css={theme => ({
                    position: "absolute",
                    width: theme.spacing(0.5),
                    right: theme.spacing(-0.5),
                    borderRadius: `0 ${theme.radius(0.5)} ${theme.radius(0.5)} 0`,
                    top: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.white,
                    zIndex: 1000,
                    display: focused ? "block" : "none",
                })}
            />
        </Paper>
    );
};
