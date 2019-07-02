/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Paper } from "@material-ui/core";
import { CSSProperties } from "react";

export interface ISelectableBlockWrapperProps {
    focused?: boolean;
    styles?: (theme: any) => CSSProperties;
}

export const SelectableBlockWrapper: React.FC<
    ISelectableBlockWrapperProps & React.ComponentProps<typeof Paper>
> = ({ children, focused = false, styles = () => {}, ...rest }) => {
    return (
        <Paper
            css={theme => ({
                boxShadow: focused ? "0px 0px 16px #bfc8d2 !important" : "",
                overflow: "hidden",
                position: "relative",
                ...styles(theme),
            })}
            {...rest}
            square={false}
            elevation={0}
        >
            <div
                style={{
                    position: "absolute",
                    width: 5,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "#2F97FF",
                    zIndex: 1000,
                    display: focused ? "" : "none",
                }}
            />
            {children}
        </Paper>
    );
};
