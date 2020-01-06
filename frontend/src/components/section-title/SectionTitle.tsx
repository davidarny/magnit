/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, Paper, Typography } from "@material-ui/core";
import * as React from "react";

interface ISectionTitleProps {
    title: string;
}

export const SectionTitle: React.FC<ISectionTitleProps> = ({ title, children }) => {
    return (
        <Grid
            item
            css={{
                height: "var(--section-title-height)",
                boxShadow: "0 6px 20px rgba(220, 227, 235, 0.3)",
            }}
        >
            <Paper
                square={true}
                css={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "none !important",
                }}
            >
                <Grid
                    container
                    css={theme => ({
                        paddingLeft: theme.spacing(4),
                        paddingRight: theme.spacing(4),
                    })}
                >
                    <Grid item xs>
                        <Typography variant="h4" component="div">
                            <span>{title}</span>
                        </Typography>
                    </Grid>
                    {children}
                </Grid>
            </Paper>
        </Grid>
    );
};

SectionTitle.displayName = "SectionTitle";
