/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";

interface ISectionTitleProps {
    title: string;
}

export const SectionTitle: React.FC<ISectionTitleProps> = ({ title, children }) => {
    return (
        <Grid
            item
            css={css`
                height: var(--section-title-height);
            `}
        >
            <Paper
                square={true}
                css={css`
                    height: 100%;
                    display: flex;
                    align-items: center;
                `}
            >
                <Grid
                    container
                    css={theme => ({
                        paddingLeft: theme.spacing(4),
                        paddingRight: theme.spacing(4),
                    })}
                >
                    <Grid
                        item
                        css={css`
                            flex-grow: 1;
                        `}
                    >
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
