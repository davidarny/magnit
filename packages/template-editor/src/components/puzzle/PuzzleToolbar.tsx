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
    const toolbar = [
        { label: "Добавить вопрос", icon: <QuestionIcon />, action: props.onAddClick },
        { label: "Добавить группу", icon: <GroupIcon />, action: props.onAddGroup },
        { label: "Добавить раздел", icon: <SectionIcon />, action: props.onAddSection },
        { label: "Скопировать", icon: <CopyIcon />, action: void 0 },
        { label: "Добавить фото", icon: <ImageIcon />, action: void 0 },
        { label: "Удалить элемент", icon: <TrashIcon />, action: void 0 },
    ];

    return (
        <Paper
            css={theme => ({
                position: "absolute",
                right: `calc(-${theme.spacing(10)} + ${right}px)`,
                marginBottom: theme.spacing(4),
                top: 0,
                transform: `translateY(${top}px)`,
                transition: "transform 0.3s ease-in-out !important",
                boxShadow: "0px 0px 16px #bfc8d2 !important",
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
                {toolbar.map(({ label, action, icon }, index) => (
                    <Grid item css={theme => ({ marginBottom: theme.spacing() })} key={index}>
                        <Grid container justify="center" alignItems="center">
                            <IconButton color="primary" aria-label={label} onClick={action}>
                                {icon}
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};
