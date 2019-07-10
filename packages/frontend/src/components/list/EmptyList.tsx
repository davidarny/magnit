/** @jsx jsx */

import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { CenteredSectionItem } from "components/centered-section-item";
import { FC, ReactNode } from "react";

interface IEmptyListProps {
    title: string;
    button: ReactNode;
    actionName: string;
    description?: string;
}

export const EmptyList: FC<IEmptyListProps> = ({ title, button, actionName, description }) => {
    return (
        <CenteredSectionItem>
            <Grid container justify="center" alignContent="center" direction="column">
                <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                    <Typography
                        component="div"
                        align="center"
                        style={{
                            fontWeight: 500,
                            fontSize: 30,
                        }}
                        css={theme => ({ color: theme.colors.black })}
                    >
                        <span>{title}</span>
                    </Typography>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                    <Typography
                        component="div"
                        align="center"
                        css={theme => ({ color: theme.colors.secondary })}
                        style={{ fontSize: 22 }}
                    >
                        <div>{description || "Для создания нажмите кнопку"}</div>
                        <div>{actionName}</div>
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
