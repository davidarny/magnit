/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { Grid } from "@material-ui/core";

export const CenteredSectionItem: React.FC = ({ children }) => {
    return (
        <Grid
            item
            xs
            css={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            `}
        >
            {children}
        </Grid>
    );
};
