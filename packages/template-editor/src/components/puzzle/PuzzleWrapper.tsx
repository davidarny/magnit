/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";

export const PuzzleWrapper: React.FC = ({ children }) => {
    return (
        <Grid
            container
            direction="column"
            css={theme => ({ paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) })}
        >
            <Grid item>{children}</Grid>
        </Grid>
    );
};
