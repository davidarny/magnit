/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Grid, Radio } from "@material-ui/core";
import * as React from "react";
import { IPuzzleProps } from "services/item";

export const RadioAnswer: React.FC<IPuzzleProps> = ({ puzzle }) => {
    return (
        <Grid item css={{ display: "flex", alignItems: "center" }}>
            <Radio disabled />
            <InputField disabled simple value={puzzle.title} />
        </Grid>
    );
};

RadioAnswer.displayName = "RadioAnswer";
