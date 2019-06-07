/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface IPuzzleWrapperProps {
    index: number;
}

export const PuzzleWrapper: React.FC<IPuzzleWrapperProps> = ({ children, index }) => {
    return (
        <Grid container direction="column">
            <Grid item>
                <Grid container alignItems="flex-end">
                    {children}
                </Grid>
            </Grid>
        </Grid>
    );
};
