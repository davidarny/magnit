/** @jsx jsx */

import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface ITaskFieldProps {
    label: string;
}

export const TaskFieldContainer: React.FC<ITaskFieldProps> = ({ label, children }) => {
    return (
        <Grid
            container
            direction="row"
            spacing={2}
            alignItems="flex-start"
            css={theme => ({ marginTop: theme.spacing() })}
        >
            <Grid item xs={2} css={theme => ({ marginTop: theme.spacing(2) })}>
                <Typography component="span">{label}</Typography>
            </Grid>
            <Grid item xs>
                {children}
            </Grid>
        </Grid>
    );
};
