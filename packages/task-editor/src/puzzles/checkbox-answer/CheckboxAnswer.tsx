/** @jsx jsx */

import * as React from "react";
import { css, jsx } from "@emotion/core";
import _ from "lodash";
import { Checkbox, Grid } from "@material-ui/core";
import { InputField } from "@magnit/components";
import { IPuzzleProps } from "services/item";

export const CheckboxAnswer: React.FC<IPuzzleProps> = ({ puzzle, index }) => {
    return (
        <Grid
            item
            css={css`
                display: flex;
                align-items: center;
            `}
        >
            <Checkbox disabled />
            <InputField disabled simple value={_.get(puzzle, "title", `Вариант ${index + 1}`)} />
        </Grid>
    );
};
