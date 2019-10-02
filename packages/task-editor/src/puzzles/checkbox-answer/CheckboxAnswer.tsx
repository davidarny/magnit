/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Checkbox, Grid } from "@material-ui/core";
import * as React from "react";
import { IPuzzleProps } from "services/item";

export const CheckboxAnswer: React.FC<IPuzzleProps> = ({ puzzle }) => {
    return (
        <Grid item css={{ display: "flex", alignItems: "center" }}>
            <Checkbox disabled />
            <InputField disabled simple value={puzzle.title} />
        </Grid>
    );
};

CheckboxAnswer.displayName = "CheckboxAnswer";
