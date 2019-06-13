/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Grid } from "@material-ui/core";

export const SectionLayout: React.FC = ({ children }) => {
    return (
        <Grid
            container
            direction="column"
            css={css`
                width: 100%;
                min-height: 100vh;
            `}
        >
            {children}
        </Grid>
    );
};
