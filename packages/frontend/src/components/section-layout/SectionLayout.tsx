/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import * as React from "react";

export const SectionLayout: React.FC = ({ children }) => {
    return (
        <Grid
            container
            direction="column"
            css={{
                width: "100%",
                minHeight: "100vh",
            }}
        >
            {children}
        </Grid>
    );
};

SectionLayout.displayName = "SectionLayout";
