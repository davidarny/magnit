/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface IPuzzleWrapperProps {
    id: string;
    index: number;
}

export const PuzzleWrapper: React.FC<IPuzzleWrapperProps> = ({ children, ...props }) => {
    return (
        <Grid
            container
            direction="column"
            key={props.id}
            css={theme => ({
                marginBottom: theme.spacing(2),
                marginTop: theme.spacing(props.index ? 6 : 0),
            })}
        >
            <Grid item>
                <Grid container alignItems="flex-end">
                    {children}
                </Grid>
            </Grid>
        </Grid>
    );
};
