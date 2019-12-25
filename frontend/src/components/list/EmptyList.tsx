/** @jsx jsx */

import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { CenteredGrid } from "components/centered-section-item";
import * as React from "react";

interface IEmptyListProps {
    title: string;
    button?: React.ReactNode;
}

export const EmptyList: React.FC<IEmptyListProps> = ({ title, button, children }) => {
    return (
        <CenteredGrid>
            <Grid container justify="center" alignContent="center" direction="column">
                <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                    <Typography
                        component="div"
                        align="center"
                        css={theme => ({
                            color: theme.colors.black,
                            fontWeight: 500,
                            fontSize: theme.fontSize.xLarge,
                        })}
                    >
                        <span>{title}</span>
                    </Typography>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                    <Typography
                        component="div"
                        align="center"
                        css={theme => ({
                            color: theme.colors.secondary,
                            fontSize: theme.colors.larger,
                        })}
                    >
                        {children}
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container justify="center" alignContent="center">
                        <Grid item>{button}</Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CenteredGrid>
    );
};

EmptyList.displayName = "EmptyList";
