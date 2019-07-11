/** @jsx jsx */

import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { CenteredSectionItem } from "components/centered-section-item";
import * as React from "react";

interface IEmptyListProps {
    title: string;
    button: React.ReactNode;
    actionName: string;
    description?: string;
}

export const EmptyList: React.FC<IEmptyListProps> = ({ title, button, description, ...props }) => {
    return (
        <CenteredSectionItem>
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
                        <div>{description || "Для создания нажмите кнопку"}</div>
                        <div>{props.actionName}</div>
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container justify="center" alignContent="center">
                        <Grid item>{button}</Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CenteredSectionItem>
    );
};
