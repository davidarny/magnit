/** @jsx jsx */

import * as React from "react";
import { css, jsx } from "@emotion/core";
import _ from "lodash";
import { Grid, Typography } from "@material-ui/core";
import { InputField } from "@magnit/components";
import { IPuzzleProps } from "services/item";

export const DropdownAnswer: React.FC<IPuzzleProps> = ({ puzzle, index }) => {
    return (
        <Grid
            item
            css={css`
                display: flex;
                align-items: center;
            `}
        >
            <Typography css={theme => ({ marginRight: theme.spacing() })}>{index + 1}.</Typography>
            <InputField disabled simple value={_.get(puzzle, "title", `Вариант ${index + 1}`)} />
        </Grid>
    );
};
