/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IFocusedPuzzleProps } from "entities";
import { Grid, TextField } from "@material-ui/core";

export const ReferenceText: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
    return (
        <Grid
            css={theme => ({
                ...(!focused ? { display: "none" } : {}),
                marginBottom: theme.spacing(),
            })}
            item
            xs={12}
        >
            <TextField placeholder="Добавьте описание" fullWidth multiline />
        </Grid>
    );
};
