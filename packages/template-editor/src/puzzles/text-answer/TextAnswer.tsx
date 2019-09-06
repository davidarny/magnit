/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Grid } from "@material-ui/core";
import * as React from "react";

export const TextAnswer: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            css={theme => ({
                paddingBottom: theme.spacing(2),
                display: focused ? "" : "none",
            })}
        >
            <Grid item xs={12}>
                <InputField disabled type="text" fullWidth placeholder="Ответ" />
            </Grid>
        </Grid>
    );
};
