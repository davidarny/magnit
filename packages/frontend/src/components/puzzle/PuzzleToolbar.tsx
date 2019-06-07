/** @jsx jsx */

import * as React from "react";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { Add as AddIcon, AddPhotoAlternate as AddPhotoIcon } from "@material-ui/icons";

interface IPuzzleToolbarProps {
    right?: number;
}

export const PuzzleToolbar: React.FC<IPuzzleToolbarProps> = ({ right = 0 }) => {
    return (
        <Paper
            css={css`
                position: absolute;
                right: calc(-100px + ${right}px);
                top: 0;
                z-index: 9999;

                &:before {
                    content: "";
                    position: absolute;
                    display: block;
                    right: 100%;
                    top: 0;
                    height: 100%;
                    width: 100%;
                }

                :hover {
                    display: block;
                }
            `}
            className="toolbar"
        >
            <Grid
                container
                direction="column"
                alignContent="center"
                css={theme => ({ padding: theme.spacing() })}
            >
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <IconButton color="primary" aria-label="Добавить элемент">
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <IconButton color="primary" aria-label="Добавить фото">
                        <AddPhotoIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};
