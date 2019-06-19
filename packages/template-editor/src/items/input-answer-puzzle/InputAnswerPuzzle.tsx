/** @jsx jsx */

import * as React from "react";
import { Grid, TextField } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { ISpecificPuzzleProps } from "entities";

export const InputAnswerPuzzle: React.FC<ISpecificPuzzleProps> = () => {
    return (
        <Grid container alignItems="flex-end">
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Ответ" disabled />
            </Grid>
        </Grid>
    );
};
