/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Paper } from "@material-ui/core";

export interface ISelectableBlockWrapperProps {
    focused?: boolean;
    styles?: (theme: any) => React.CSSProperties;
}

type TPaperProps = React.ComponentProps<typeof Paper>;
type TSelectableBlockWrapperProps = ISelectableBlockWrapperProps & TPaperProps;

export const SelectableBlockWrapper: React.FC<TSelectableBlockWrapperProps> = props => {
    const { children, focused = false, styles = () => {}, ...rest } = props;
    return (
        <Paper
            css={theme => ({
                boxShadow: focused ? "0px 0px 16px #bfc8d2 !important" : "none",
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
                    display: focused ? "block" : "none",
                }}
            />
            {children}
        </Paper>
    );
};
