/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { FormControl, Grid, Input, InputAdornment, InputLabel } from "@material-ui/core";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";
import * as React from "react";

export const DateAnswer: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
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
                <FormControl disabled>
                    <InputLabel htmlFor="date-answer-puzzle">День, месяц, год</InputLabel>
                    <Input
                        id="date-answer-puzzle"
                        type="text"
                        disabled
                        endAdornment={
                            <InputAdornment position="end">
                                <CalendarIcon />
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};
