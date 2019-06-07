/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Grid } from "@material-ui/core";

export const SectionLayout: React.FC = ({ children }) => {
    return (
        <Grid
            container
            direction="column"
            css={theme => ({
                paddingBottom: theme.spacing(30),
                width: "100%",
                minHeight: "100vh",
                overflow: "hidden",
            })}
        >
            {children}
        </Grid>
    );
};
