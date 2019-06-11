/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, TextField, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";

export const SectionPuzzle: React.FC<ISpecificPuzzleProps> = props => {
    return (
        <React.Fragment>
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="subtitle2">Раздел {props.index + 1}.</Typography>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Название раздела" />
            </Grid>
        </React.Fragment>
    );
};
