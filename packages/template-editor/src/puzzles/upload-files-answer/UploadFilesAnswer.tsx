/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { IFocusedPuzzleProps } from "entities";
import { Fab } from "@magnit/components";
import { AddIcon } from "@magnit/icons";

export const UploadFilesAnswer: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
    return (
        <Grid
            css={theme => ({
                ...(!focused ? { display: "none" } : {}),
                width: theme.spacing(25),
                height: theme.spacing(17),
                border: `1px solid ${theme.colors.lightGray}`,
                borderRadius: theme.radius(0.5),
                opacity: 0.8,
                pointerEvents: "none",
            })}
        >
            <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                css={css`
                    width: 100%;
                    height: 100%;
                `}
            >
                <Fab
                    css={theme => ({
                        width: theme.spacing(5),
                        height: theme.spacing(5),
                        marginBottom: theme.spacing(),
                    })}
                >
                    <AddIcon />
                </Fab>
                <Typography
                    css={theme => ({
                        userSelect: "none",
                        fontSize: theme.fontSize.sNormal,
                        color: theme.colors.secondary,
                    })}
                    align="center"
                >
                    Добавить файл
                </Typography>
            </Grid>
        </Grid>
    );
};
