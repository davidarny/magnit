/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import * as React from "react";

export const SectionLayout: React.FC<React.ComponentProps<typeof Grid>> = props => {
    const { children, ...rest } = props;

    return (
        <Grid
            container
            direction="column"
            css={{
                width: "100%",
                minHeight: "100vh",
            }}
            {...rest}
        >
            {children}
        </Grid>
    );
};

SectionLayout.displayName = "SectionLayout";
