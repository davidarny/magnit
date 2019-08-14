/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface IPuzzleWrapperProps {
    id?: string;
    noWrapper?: boolean;

    onFocus?(): void;

    onMouseDown?(): void;
}

export const PuzzleWrapper: React.FC<IPuzzleWrapperProps> = ({ children, id, ...props }) => {
    if (props.noWrapper) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <Grid
            id={id}
            container
            direction="column"
            css={theme => ({
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
                // need for correct toolbar positioning
                // see https://github.com/DavidArutiunian/magnit/issues/46
                marginTop: theme.spacing(-3),
                paddingTop: theme.spacing(3),
            })}
            onFocus={props.onFocus}
            onMouseDown={props.onFocus}
        >
            <Grid item>{children}</Grid>
        </Grid>
    );
};
