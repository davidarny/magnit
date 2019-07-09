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
                    ? `0px 0px ${theme.spacing(2)} ${theme.colors.shadowGray}`
                    : "none",
                position: "relative",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                ...css(theme),
            })}
            square={false}
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
        </Paper>
    );
};
