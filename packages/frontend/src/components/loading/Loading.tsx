/** @jsx jsx */

import { jsx } from "@emotion/core";
import { CircularProgress, Grid } from "@material-ui/core";
import * as React from "react";

export const Loading: React.FC = () => {
    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            css={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 10000,
            }}
        >
            <Grid item>
                <CircularProgress css={theme => ({ color: theme.colors.primary })} />
            </Grid>
        </Grid>
    );
};

Loading.displayName = "Loading";
