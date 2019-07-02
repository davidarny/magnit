/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "entities";
import { InputField } from "components/fields";

export const TextAnswerPuzzle: React.FC<IFocusedPuzzleProps> = ({ questionFocused }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            css={theme => ({
                paddingBottom: theme.spacing(2),
                display: questionFocused ? "" : "none",
            })}
        >
            <Grid item xs={12}>
                <InputField disabled type="text" fullWidth placeholder="Ответ" />
            </Grid>
        </Grid>
    );
};
