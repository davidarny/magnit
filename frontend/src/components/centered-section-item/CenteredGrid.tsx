/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import * as React from "react";

export const CenteredGrid: React.FC<React.ComponentProps<typeof Grid>> = props => {
    const { children, ...rest } = props;

    return (
        <Grid
            item
            xs
            css={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
            {...rest}
        >
            {children}
        </Grid>
    );
};

CenteredGrid.displayName = "CenteredSectionItem";
