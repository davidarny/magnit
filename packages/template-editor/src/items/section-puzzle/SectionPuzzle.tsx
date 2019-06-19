/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, TextField, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({ title, index }) => {
    return (
        <Grid container alignItems="flex-end" spacing={2}>
            <Grid item xs={1}>
                <Typography variant="h6">Раздел {index + 2}.</Typography>
            </Grid>
            <Grid item xs={11}>
                <TextField fullWidth label="Название раздела" defaultValue={title} />
            </Grid>
        </Grid>
    );
};
