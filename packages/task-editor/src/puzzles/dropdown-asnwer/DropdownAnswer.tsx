/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { IPuzzleProps } from "services/item";

export const DropdownAnswer: React.FC<IPuzzleProps> = ({ puzzle, index }) => {
    return (
        <Grid item css={{ display: "flex", alignItems: "center" }}>
            <Typography css={theme => ({ marginRight: theme.spacing() })}>{index + 1}.</Typography>
            <InputField disabled simple value={puzzle.title} />
        </Grid>
    );
};

DropdownAnswer.displayName = "DropdownAnswer";
