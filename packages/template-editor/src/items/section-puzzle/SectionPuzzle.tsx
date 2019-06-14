/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, TextField, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({ title, index }) => {
    return (
        <Grid container alignItems="flex-end">
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="subtitle2">Раздел {index + 1}.</Typography>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Название раздела" defaultValue={title} />
            </Grid>
        </Grid>
    );
};
