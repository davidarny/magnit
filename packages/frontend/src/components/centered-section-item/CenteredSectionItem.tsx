/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import * as React from "react";

export const CenteredSectionItem: React.FC = ({ children }) => {
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
        >
            {children}
        </Grid>
    );
};

CenteredSectionItem.displayName = "CenteredSectionItem";
