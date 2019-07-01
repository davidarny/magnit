/** @jsx jsx */

import * as React from "react";
import { FormControl, Grid, Input, InputAdornment, InputLabel } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "entities";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";

export const DateAnswerPuzzle: React.FC<IFocusedPuzzleProps> = ({ questionFocused }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            style={{ display: questionFocused ? "" : "none" }}
            css={theme => ({ paddingBottom: theme.spacing(2) })}
        >
            <Grid item xs={12}>
                <FormControl>
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
