/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, TextField, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";

interface IQuestionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
}

export const QuestionPuzzle: React.FC<IQuestionPuzzleProps> = ({ title, index }) => {
    return (
        <Grid container alignItems="flex-end">
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="body1">{index + 1}.</Typography>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Название вопроса" defaultValue={title} />
            </Grid>
        </Grid>
    );
};
