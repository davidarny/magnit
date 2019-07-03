/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "entities";
import { InputField } from "@magnit/components";

export const NumericAnswerPuzzle: React.FC<IFocusedPuzzleProps> = ({ questionFocused }) => {
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
                <InputField
                    disabled
                    type="number"
                    fullWidth
                    placeholder="Ответ"
                    css={theme => ({
                        "input::-webkit-inner-spin-button, input::-webkit-outer-spin-button": {
                            margin: 0,
                            display: "none",
                        },
                    })}
                />
            </Grid>
        </Grid>
    );
};
