/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import _ from "lodash";
import { Grid, Radio } from "@material-ui/core";
import { InputField } from "@magnit/components";
import { IPuzzleProps } from "services/item";

export const RadioAnswer: React.FC<IPuzzleProps> = ({ puzzle, index }) => {
    return (
        <Grid
            item
            css={css`
                display: flex;
                align-items: center;
            `}
        >
            <Radio disabled />
            <InputField disabled simple value={_.get(puzzle, "title", `Вариант ${index + 1}`)} />
        </Grid>
    );
};
