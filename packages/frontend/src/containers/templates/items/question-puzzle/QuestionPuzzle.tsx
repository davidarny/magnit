/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities/template";
import { Grid, TextField, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";

export const QuestionPuzzle: React.FC<ISpecificPuzzleProps> = props => {
    return (
        <>
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="body1">{props.index + 1}.</Typography>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Название вопроса" />
            </Grid>
        </>
    );
};
