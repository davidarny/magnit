/** @jsx jsx */

import * as React from "react";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { CopyIcon, GroupIcon, ImageIcon, QuestionIcon, SectionIcon, TrashIcon } from "icons";

interface IPuzzleToolbarProps {
    right?: number;
    top?: number;

    onAddClick?(): void;

    onAddGroup?(): void;

    onAddSection?(): void;
}

export const PuzzleToolbar: React.FC<IPuzzleToolbarProps> = ({ right = 0, top = 0, ...props }) => {
    return (
        <Paper
            css={theme => ({
                position: "absolute",
                right: `calc(-${theme.spacing(10)} + ${right}px)`,
                marginBottom: theme.spacing(4),
                top: 0,
                transform: `translateY(${top}px)`,
                willChange: "transform",
                transition: "transform 0.3s ease-in-out",
            })}
            className="toolbar"
        >
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                css={theme => ({ padding: theme.spacing() })}
            >
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton
                            color="primary"
                            aria-label="Добавить вопрос"
                            onClick={props.onAddClick}
                        >
                            <QuestionIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton
                            onClick={props.onAddGroup}
                            color="primary"
                            aria-label="Добавить группу"
                        >
                            <GroupIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton
                            color="primary"
                            onClick={props.onAddSection}
                            aria-label="Добавить раздел"
                        >
                            <SectionIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton color="primary" aria-label="Скопировать">
                            <CopyIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton color="primary" aria-label="Добавить фото">
                            <ImageIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item css={theme => ({ marginBottom: theme.spacing() })}>
                    <Grid container justify="center" alignItems="center">
                        <IconButton color="primary" aria-label="Удалить элемент">
                            <TrashIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
