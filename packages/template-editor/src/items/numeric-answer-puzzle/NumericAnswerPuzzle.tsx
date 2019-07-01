/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "entities";
import { InputField } from "../../components/fields";

export const NumericAnswerPuzzle: React.FC<IFocusedPuzzleProps> = ({ questionFocused }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            style={{ display: questionFocused ? "" : "none" }}
            css={theme => ({ paddingBottom: theme.spacing(2) })}
        >
            <Grid item xs={12}>
                <InputField
                    type="number"
                    fullWidth
                    placeholder="Ответ"
                    css={(theme) => ({
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
