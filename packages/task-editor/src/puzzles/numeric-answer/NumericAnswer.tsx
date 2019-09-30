/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Grid } from "@material-ui/core";
import * as React from "react";
import { IPuzzleProps } from "services/item";

export const NumericAnswer: React.FC<IPuzzleProps> = ({ answer }) => {
    return (
        <Grid item css={{ display: "flex", alignItems: "center" }}>
            <InputField disabled simple value={answer ? answer.answer : ""} />
        </Grid>
    );
};

NumericAnswer.displayName = "NumericAnswer";
